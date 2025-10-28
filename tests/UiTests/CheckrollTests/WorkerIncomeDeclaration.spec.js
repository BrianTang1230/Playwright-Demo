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

import {
  checkrollSQLCommand,
  checkrollGridSQLCommand,
} from "@UiFolder/queries/CheckrollQuery";

import {
  InputPath,
  JsonPath,
  DocNo,
  GridPath,
} from "@utils/data/uidata/checkrollData.json";

import {
  WorkerIncomeDeclarationCreate,
  WorkerIncomeDeclarationEdit,
  WorkerIncomeDeclarationDelete,
} from "@UiFolder/pages/Checkroll/WorkerIncomeDeclaration";

import Login from "@utils/data/uidata/loginData.json";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "CR_Data";
const module = "Checkroll";
const submodule = "Income Tax";
const formName = "Worker Income Declaration (EA Form)";
const keyName = "WorkerIncomeDeclarationEAForm";
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1], [1, 2, 3, 4, 5, 6, 7]];

test.describe.serial("Worker Income Declaration (EA Form) Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    if (Login.Region === "IND") test.skip(true);

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

  // ---------------- Before Each ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Test ----------------
  test("Create Worker Income Declaration (EA Form)", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { Date: createValues[0], OU: ou[0] });

    const { uiVals, gridVals } = await WorkerIncomeDeclarationCreate(
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

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
    await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await ValidateDBValues(
      gridCreateValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Worker Income Declaration (EA Form)", async ({ page, db }) => {
    const { uiVals, gridVals } = await WorkerIncomeDeclarationEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
      ou,
      gridCreateValues[0] // need to add keyword to identify the record
    );
    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(
      gridEditValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Worker Income Declaration (EA Form)", async ({ page, db }) => {
    await WorkerIncomeDeclarationDelete(
      page,
      sideMenu,
      createValues,
      ou,
      gridEditValues[0]
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    if (dbValues.length > 0) {
      throw new Error(`Deleting ${formName} failed`);
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    console.log(`End Running: ${formName}`);
  });
});
