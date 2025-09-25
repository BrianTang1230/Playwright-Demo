import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/pages/General/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import { nurserySQLCommand } from "@UiFolder/queries/NurseryQuery";
import {
  InputPath,
  JsonPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";

import {
  MainNurseryTransferLossCreate,
  MainNurseryTransferLossDelete,
  MainNurseryTransferLossEdit,
} from "@UiFolder/pages/Nursery/MainNurseryTransferLoss";

// ---------------- Set Global Variables ----------------
let db;
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Main Nursery";
const formName = "Main Nursery Transfer/Loss";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Main Nursery Transfer/Loss Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Read Excel values
    createValues = (
      await excel.readExcel(sheetName, formName, "CreateData")
    ).split(";");
    editValues = (await excel.readExcel(sheetName, formName, "EditData")).split(
      ";"
    );
    ou = await excel.readExcel(sheetName, formName, "OperatingUnit");

    // Clean up existing record if any
    docNo = DocNo[keyName];
    if (docNo) {
      const deleteSQL = await excel.readExcel(sheetName, formName, "DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo });
    }

    console.log(`Start Running: ${formName}`);
  });

  // ---------------- Before Each ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Test ----------------
  test("Create Main Nursery Transfer/Loss", async ({ page, db }) => {
    const result = await MainNurseryTransferLossCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    docNo = await page.locator("#txtNTNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(page, paths, result);
    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Main Nursery Transfer/Loss", async ({ page, db }) => {
    const allValues = await MainNurseryTransferLossEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(editValues, columns, allValues[0]);
    await ValidateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Main Nursery Transfer/Loss", async ({ page, db }) => {
    await MainNurseryTransferLossDelete(
      page,
      sideMenu,
      createValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error(`Deleting Main Nursery Transfer/Loss failed`);
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {
    console.log(`End Running: ${formName}`);
  });
});
