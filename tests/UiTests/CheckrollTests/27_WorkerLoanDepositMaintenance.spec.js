import { test, region } from "@utils/commonFunctions/GlobalSetup";
import { allPhases } from "@utils/data/uidata/globalData.json";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import {
  checkLength,
  setCurrForm,
  setCurrPhase,
  throwTestFailMsg,
} from "@UiFolder/functions/comFuncs";
import {
  validateFormValues,
  validateGridValues,
  validateDBValues,
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
  WorkerLoanDepositMaintenanceEdit1,
  WorkerLoanDepositMaintenanceEdit2,
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
let phaseCount = 0;
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

test.describe.serial(`${formName} Tests`, () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Change Current Form and Phase
    await setCurrForm(formName);
    await setCurrPhase(allPhases[phaseCount]);

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

    console.log(`${"=".repeat(90)}\nStart Running: ${formName}`);
  });

  // ---------------- Before Each ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();

    // Update Phase
    phaseCount++;
    await setCurrPhase(allPhases[phaseCount]);
  });

  // ---------------- Create Test ----------------
  test(`Create ${formName}`, async ({ page, db }) => {
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
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);

    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await WorkerLoanDepositMaintenanceEdit1(
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
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);

    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await WorkerLoanDepositMaintenanceEdit2(
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
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        Date: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);

    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
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
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    await db.deleteData(deleteSQL, {
      Date: createValues[0],
      OU: ou[0],
    });
    console.log(`End Tests Running: ${formName}\n${"=".repeat(90)}`);
  });
});
