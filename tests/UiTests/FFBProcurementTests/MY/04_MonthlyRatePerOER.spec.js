import { test } from "@utils/commonFunctions/GlobalSetup";
import { LoginPage, region } from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateDBValues,
  ValidateGridValues,
} from "@UiFolder/functions/ValidateValues";

import { ffbSQLCommand, ffbGridSQLCommand } from "@UiFolder/queries/FFBQuery";
import { JsonPath, InputPath, GridPath } from "@utils/data/uidata/ffbData.json";

import {
  MonthlyRatePerOERCreate,
  MonthlyRatePerOERDelete,
  MonthlyRatePerOEREdit,
} from "@UiFolder/pages/FFBProcurement/04_MonthlyRatePerOER";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "FFB_DATA";
const module = "FFB Procurement";
const submodule = null;
const formName = "Monthly Rate Per OER";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Monthly Rate Per OER Tests", () => {
  if (region === "IND") test.skip(true);

  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName
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

  // ---------------- Create Test ----------------
  test("Create New Monthly Rate Per OER", async ({ page, db }) => {
    await db.deleteData(deleteSQL, {
      Date: createValues[0],
      OU: ou[0],
      Nation: createValues[1],
    });

    const { uiVals, gridVals } = await MonthlyRatePerOERCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
      Nation: createValues[1],
    });

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0]],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Monthly Rate Per OER", async ({ page, db }) => {
    const { uiVals } = await MonthlyRatePerOEREdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
      Nation: createValues[1],
    });

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou[0]],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Monthly Rate Per OER", async ({ page, db }) => {
    await MonthlyRatePerOERDelete(page, sideMenu, createValues, ou);

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
      Nation: createValues[1],
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Monthly Rate Per OER failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    console.log(`End Running: ${formName}`);
  });
});
