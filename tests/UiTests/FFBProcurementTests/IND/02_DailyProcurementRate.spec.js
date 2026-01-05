import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
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
  DailyProcurementRateCreate,
  DailyProcurementRateDelete,
  DailyProcurementRateEdit,
} from "@UiFolder/pages/FFBProcurement/IND/02_DailyProcurementRate";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "FFB_DATA";
const module = "FFB Procurement";
const submodule = null;
const formName = "Daily Procurement Rate";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2]];

test.describe.serial("Daily Procurement Rate Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    // Load Excel values
    [
      createValues,
      editValues,
      deleteSQL,
      ou,
      gridCreateValues,
      gridEditValues,
    ] = await excel.loadExcelValues(sheetName, formName, { hasGrid: true });

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
  test("Create New Daily Procurement Rate", async ({ page, db }) => {
    await db.deleteData(deleteSQL, {
      Date: createValues[0],
      Area: createValues[1],
      OU: ou[0],
    });

    const { uiVals, gridVals } = await DailyProcurementRateCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
      ou
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      Date: createValues[0],
      Area: createValues[1],
    });

    const gridDbValues = await db.retrieveGridData(
      ffbGridSQLCommand(formName),
      {
        Date: createValues[0],
        Area: createValues[1],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
    await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test("Edit Daily Procurement Rate", async ({ page, db }) => {
    const { uiVals, gridVals } = await DailyProcurementRateEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
      ou
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      Date: createValues[0],
      Area: createValues[1],
    });

    const gridDbValues = await db.retrieveGridData(
      ffbGridSQLCommand(formName),
      {
        Date: createValues[0],
        Area: createValues[1],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test("Delete Daily Procurement Rate", async ({ page, db }) => {
    await DailyProcurementRateDelete(
      page,
      sideMenu,
      createValues,
      ou
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      Date: createValues[0],
      Area: createValues[1],
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Daily Procurement Rate failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ }) => {
    console.log(`End Running: ${formName}`);
  });
});
