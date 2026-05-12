import { test } from "@utils/commonFunctions/GlobalSetup";
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
  validateDBValues,
  validateGridValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  payrollSQLCommand,
  payrollGridSQLCommand,
} from "@UiFolder/queries/PayrollQuery";
import {
  InputPath,
  JsonPath,
  DocNo,
  GridPath,
} from "@utils/data/uidata/payrollData.json";

import {
  StaffLoanDepositMaintenanceCreate,
  StaffLoanDepositMaintenanceEdit1,
  StaffLoanDepositMaintenanceEdit2,
  StaffLoanDepositMaintenanceDelete,
} from "@UiFolder/pages/Payroll/06_StaffLoanDepositMaintenance";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
let phaseCount = 0;
const sheetName = "PR_Data";
const module = "Payroll";
const submodule = "Miscellaneous";
const formName = "Staff Loan/Deposit Maintenance";
const keyName = "StaffLoanDepositMaintenance";
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 5],
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

    console.log(`Start Running: ${formName}`);
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
    await db.deleteData(deleteSQL, {
      Date: createValues[0],
      OU: ou[0],
    });

    const { uiVals, gridVals } = await StaffLoanDepositMaintenanceCreate(
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

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      Date: createValues[0],
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
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
    const { uiVals, gridVals } = await StaffLoanDepositMaintenanceEdit1(
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
      gridCreateValues[0].split(";")[0], // need to add keyword to identify the record
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      Date: createValues[0],
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
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
    const { uiVals, gridVals } = await StaffLoanDepositMaintenanceEdit2(
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
      gridCreateValues[0].split(";")[0], // need to add keyword to identify the record
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      Date: createValues[0],
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
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
    await StaffLoanDepositMaintenanceDelete(
      page,
      sideMenu,
      createValues,
      ou,
      gridEditValues[0].split(";")[0],
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
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
    console.log(`End Running: ${formName}`);
  });
});
