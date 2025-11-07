import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import {
  payrollSQLCommand,
  payrollGridSQLCommand,
} from "@UiFolder/queries/PayrollQuery";

import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/payrollData.json";

import {
  StaffPrecedingTaxCreate,
  StaffPrecedingTaxEdit,
  StaffPrecedingTaxDelete,
} from "@UiFolder/pages/Payroll/08_StaffPrecedingTax";

import Login from "@utils/data/uidata/loginData.json";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "PR_DATA";
const module = "Payroll";
const submodule = "Income Tax";
const formName = "Staff Preceding Tax (PPh 21)";
const keyName = "StaffPrecedingTax";
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2, 3, 4, 5]];

test.describe.serial("Staff Preceding Tax (PPh 21) Tests", async () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    if (Login.Region === "MY") test.skip(true);

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

    docNo = DocNo[keyName];

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
  test("Create New Staff Preceding Tax (PPh 21)", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals, gridVals } = await StaffPrecedingTaxCreate(
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

    docNo = await editJson(
      JsonPath,
      keyName,
      await page.locator("#PreTaxSubNum").inputValue()
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0]],
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
  test("Edit Staff Preceding Tax (PPh 21)", async ({ page, db }) => {
    await StaffPrecedingTaxEdit(
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
      docNo
    );

    const uiVals = await getUiValues(page, paths);
    const gridVals = await getGridValues(page, gridPaths, cellsIndex);

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou[0]],
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
  test("Delete Staff Preceding Tax (PPh 21)", async ({ page, db }) => {
    await StaffPrecedingTaxDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Staff Preceding Tax (PPh 21) failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    console.log(`End Running: ${formName}`);
  });
});
