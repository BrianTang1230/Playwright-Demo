import { test } from "@UiFolder/functions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/pages/General/DBHelper";
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
  PreNurseryTransferToCreate,
  PreNurseryTransferToEdit,
  PreNurseryTransferToDelete,
} from "@UiFolder/pages/Nursery/PreNurseryTransferTo";

// ---------------- Global Variables ----------------
let db;
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Pre Nursery";
const formName = "Inter-OU Pre Nursery Transfer To";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Inter-OU Pre Nursery Transfer To Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Read Excel values
    createValues = (
      await excel.readExcel(sheetName, formName, "CreateData")
    ).split(";");
    editValues = (await excel.readExcel(sheetName, formName, "EditData")).split(
      ";"
    );
    ou = (await excel.readExcel(sheetName, formName, "OperatingUnit")).split(
      ";"
    );

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
  test("Create Inter-OU Pre Nursery Transfer To", async ({ page, db }) => {
    const allValues = await PreNurseryTransferToCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    docNo = await page.locator("#txtPTONum").inputValue();
    await editJson(JsonPath, formName, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(createValues, columns, allValues[0]);
    await ValidateDBValues(
      [...createValues, ou[0], ou[1]],
      [...columns, "FromOU", "ToOU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Inter-OU Pre Nursery Transfer To", async ({ page, db }) => {
    const allValues = await PreNurseryTransferToEdit(
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
      [...editValues, ou[0], ou[1]],
      [...columns, "FromOU", "ToOU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Inter-OU Pre Nursery Transfer To", async ({ page, db }) => {
    await PreNurseryTransferToDelete(
      page,
      sideMenu,
      createValues,
      ou[0],
      docNo
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error("Deleting Inter-OU Pre Nursery Transfer To failed");
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {
    console.log(`End Running: ${formName}`);
  });
});
