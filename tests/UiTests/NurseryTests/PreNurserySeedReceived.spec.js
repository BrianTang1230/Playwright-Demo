import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import { InputPath, JsonPath, ID } from "@utils/data/uidata/nurseryData.json";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";
import {
  PreNurserySeedReceivedCreate,
  PreNurserySeedReceivedEdit,
  //   PreNurserySeedReceivedDelete,
} from "@UiFolder/pages/Nursery/PreNurserySeedReceived";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import { nurserySQLCommand } from "../../../testsfolders/UiTestsFolder/uiutils/NurseryQuery";
import { SelectRecord, FilterRecord } from "@UiFolder/functions/OpenRecord";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;
let db;
let ou;
let docNo;

// Excel info
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Pre Nursery";
const formName = "Pre Nursery Seed Received";
const paths = InputPath.PreNurserySeedReceivedPath.split(",");
const columns = InputPath.PreNurserySeedReceivedColumn.split(",");

test.describe("Pre-Nursery Seed Received Tests", () => {
  test.beforeAll(async () => {
    // Initialize Excel connection
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();

    // Read Excel data once
    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");

    // Initialize database connection
    db = new DBHelper("MY");
    await db.connect();

    // Delete a country code if it exists
    docNo = ID.PreNurserySeedReceived;
    if (!docNo) {
      const deleteSQL = await connectExcel.readExcel("DeleteSQL");
      await db.deleteData(deleteSQL, { DocNum: docNo });
    }
    ou = await connectExcel.readExcel("OperatingUnit");
  });

  // ---------------- Before Each ----------------
  test.beforeEach(async ({ page }) => {
    // Login and navigate to the form
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm(module, submodule, formName);

    // Initialize side menu
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  test("Create Pre-Nursery Seed Received", async ({ page }) => {
    const allValues = await PreNurserySeedReceivedCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    // Saved DocNo
    docNo = await page.locator("#txtPSRNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    await ValidateUiValues(createValues, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateDBValues([...createValues, ou], columns, dbValues[0]);
  });

  test("Edit Pre-Nursery Seed Received", async ({ page }) => {
    // Select the created record
    await FilterRecord(page, createValues, ou, docNo);

    const allValues = await PreNurserySeedReceivedEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou
    );

    await ValidateUiValues(editValues, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      Code: editValues[0],
    });

    await ValidateDBValues(editValues, columns, dbValues[0]);
  });

  // test("Delete Pre-Nursery Seed Received", async ({ page }) => {
  //   await PreNurserySeedReceivedDelete(page);
  // });
});
