import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import { masterSQLCommand } from "@UiFolder/queries/MasterQuery";
import { JsonPath, InputPath } from "@utils/data/uidata/masterData.json";

import {
  FieldSetupCreate,
  FieldSetupEdit,
  FieldSetupDelete,
} from "@UiFolder/pages/MasterFile/12_FieldSetupPage";

// ---------------- Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "General";
const formName = "Field Setup";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Field Setup Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName,
      {}
    );

    await checkLength(paths, columns, createValues, editValues);

    console.log(`Start Running: ${formName}`);
  });

  // ---------------- Before Each  ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Tests ----------------
  test("Create New Field Code", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { Code: createValues[0], OU: ou[0] });

    const { uiVals } = await FieldSetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
      OU: ou[0],
    });

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
  });

  test("Edit Field Code", async ({ page, db }) => {
    const { uiVals } = await FieldSetupEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
      OU: ou[0],
    });

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
  });

  test("Delete Field Code", async ({ page, db }) => {
    await FieldSetupDelete(page, sideMenu, editValues, ou);

    // Check if the Field Code is deleted
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
      OU: ou[0],
    });

    if (dbValues.length > 0) {
      throw new Error("DB validation failed when deleting Field Code");
    }
  });

  test.afterAll(async () => {
    // Close database connection
    console.log(`End Running: ${formName}`);
  });
});
