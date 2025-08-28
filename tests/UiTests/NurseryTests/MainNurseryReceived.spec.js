import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import {
  InputPath,
  JsonPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";
import {
  MainNurseryReceivedCreate,
  MainNurseryReceivedEdit,
  MainNurseryReceivedDelete,
} from "@UiFolder/pages/Nursery/MainNurseryReceived";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import { nurserySQLCommand } from "@UiFolder/uiutils/NurseryQuery";

let sideMenu;
let connectExcel;
let createValues;
let editValues;
let db;
let ou;
let docNo;

const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Main Nursery";
const formName = "Main Nursery Received";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Main Nursery Received Tests", () => {
  test.beforeAll(async () => {
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();

    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");

    db = new DBHelper();
    await db.connect();

    docNo = DocNo[keyName];
    if (docNo) {
      const deleteSQL = await connectExcel.readExcel("DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo });
    }
    ou = await connectExcel.readExcel("OperatingUnit");
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm(module, submodule, formName);

    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  test("Create Main Nursery Received", async ({ page }) => {
    const allValues = await MainNurseryReceivedCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    docNo = await page.locator("#txtNRNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    await ValidateUiValues(createValues, columns, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  test("Edit Main Nursery Received", async ({ page }) => {
    const allValues = await MainNurseryReceivedEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    await ValidateUiValues(editValues, columns, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  test("Delete Main Nursery Received", async ({ page }) => {
    await MainNurseryReceivedDelete(page, sideMenu, editValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error(`Deleting Main Nursery Received failed`);
    }
  });

  test.afterAll(async () => {
    // Close database connection
    await db.closeAll();
  });
});
