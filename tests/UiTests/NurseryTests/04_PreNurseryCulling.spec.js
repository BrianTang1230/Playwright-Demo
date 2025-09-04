import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import { nurserySQLCommand } from "@UiFolder/uiutils/NurseryQuery";
import {
  InputPath,
  JsonPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";

import {
  PreNurseryCullingCreate,
  PreNurseryCullingEdit,
  PreNurseryCullingDelete,
} from "@UiFolder/pages/Nursery/PreNurseryCulling";

// ---------------- Global Variables ----------------
let db;
let ou;
let docNo;
let sideMenu;
let connectExcel;
let createValues;
let editValues;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Pre Nursery";
const formName = "Pre Nursery Culling";
const keyName = formName.split(" ").join("");
const paths = InputPath.PreNurseryCullingPath.split(",");
const columns = InputPath.PreNurseryCullingColumn.split(",");

test.describe.serial("Pre Nursery Culling Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async () => {
    // Init Excel + DB
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();
    db = new DBHelper();
    await db.connect();

    // Read Excel values
    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");
    ou = await connectExcel.readExcel("OperatingUnit");

    // Clean up existing record if any
    docNo = DocNo[keyName];
    if (docNo) {
      const deleteSQL = await connectExcel.readExcel("DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo });
    }
  });

  // ---------------- Before Each ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Test ----------------
  test("Create Pre Nursery Culling", async ({ page }) => {
    const allValues = await PreNurseryCullingCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    // Save document number to json file
    docNo = await page.locator("#txtPCNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(createValues, columns, allValues[0]);
    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Pre Nursery Culling", async ({ page }) => {
    const allValues = await PreNurseryCullingEdit(
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
  test("Delete Pre Nursery Culling", async ({ page }) => {
    await PreNurseryCullingDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error("Deleting Pre Nursery Culling failed");
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {
    await db.closeAll();
  });
});
