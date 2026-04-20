import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateFormValues,
  ValidateDBValues,
  ValidateGridValues,
} from "@UiFolder/functions/valuesFuncs";

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
  WorkerLoanDepositMaintenanceCreate,
  WorkerLoanDepositMaintenanceEdit,
  WorkerLoanDepositMaintenanceDelete,
} from "@UiFolder/pages/Checkroll/27_WorkerLoanDepositMaintenance";

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
const submodule = "Miscellaneous";
const formName = "Worker Loan/Deposit Maintenance";
const keyName = "WorkerLoanDepositMaintenance";
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 6],
  [1, 4, 5, 6],
];

test.describe.serial("Worker Loan/Deposit Maintenance Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
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
  test("Create Worker Loan/Deposit Maintenance", async ({ page, db }) => {
    await db.deleteData(deleteSQL, {
      Date: createValues[0],
      OU: ou[0],
    });

    const { uiVals, gridVals } = await WorkerLoanDepositMaintenanceCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
      ou,
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      Date: createValues[0],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
        OU: ou[0],
      },
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateFormValues(createValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);

    await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test("Edit Worker Loan/Deposit Maintenance", async ({ page, db }) => {
    const { uiVals, gridVals } = await WorkerLoanDepositMaintenanceEdit(
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
      gridCreateValues.join(";").split(";")[0], // need to add keyword to identify the record
    );
    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      Date: createValues[0],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
        OU: ou[0],
      },
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateFormValues(editValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);

    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test("Delete Worker Loan/Deposit Maintenance", async ({ page, db }) => {
    await WorkerLoanDepositMaintenanceDelete(
      page,
      sideMenu,
      createValues,
      ou,
      gridEditValues.join(";").split(";")[0],
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      Date: createValues[0],
    });

    if (dbValues.length > 0) throw new Error(`Deleting ${formName} failed`);

    console.log("\n" + `${formName} transaction deleted successfully!` + "\n");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    console.log(`End Running: ${formName}`);
  });
});
