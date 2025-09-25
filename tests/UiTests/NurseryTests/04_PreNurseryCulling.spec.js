import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { checkLength } from "@UiFolder/functions/comFuncs";
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
  PreNurseryCullingCreate,
  PreNurseryCullingEdit,
  PreNurseryCullingDelete,
} from "@UiFolder/pages/Nursery/PreNurseryCulling";

// ---------------- Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Pre Nursery";
const formName = "Pre Nursery Culling";
const keyName = formName.split(" ").join("");
const paths = InputPath.PreNurseryCullingPath.split(",");
const columns = InputPath.PreNurseryCullingColumn.split(",");

test.describe.serial("Pre Nursery Culling Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName
    );

    await checkLength(paths, columns, createValues, editValues);

    // Clean up existing record if any
    docNo = DocNo[keyName];
    if (docNo) {
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
  test("Create Pre Nursery Culling", async ({ page, db }) => {
    await PreNurseryCullingCreate(
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

    const uiVals = await getUiValues(page, paths);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Pre Nursery Culling", async ({ page, db }) => {
    await PreNurseryCullingEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    const uiVals = await getUiValues(page, paths);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Pre Nursery Culling", async ({ page, db }) => {
    await PreNurseryCullingDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error("Deleting Pre Nursery Culling failed");
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {});
});
