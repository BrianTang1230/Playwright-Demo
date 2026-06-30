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
  payrollGridSQLCommand,
  payrollSQLCommand,
} from "@UiFolder/queries/PayrollQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/payrollData.json";

import {
  StaffCP38Create,
  StaffCP38Edit1,
  StaffCP38Edit2,
  StaffCP38Delete,
} from "@UiFolder/pages/Payroll/04_StaffCP38";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
let phaseCount = 0;
const sheetName = "PR_DATA";
const module = "Payroll";
const submodule = "Income Tax";
const formName = "Staff CP38";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2]];

test.describe.serial(`${formName} Tests`, async () => {
  if (region === "IND") test.skip(true);
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

    docNo = DocNo[keyName];

    console.log(`Start Running: ${formName}`);
  });

  // ---------------- Before Each  ----------------
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
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals, gridVals } = await StaffCP38Create(
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

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtADTNum").inputValue(),
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      Date: createValues[0],
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
      {
        DocNo: docNo,
      },
    );
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test (Without Saving) ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await StaffCP38Edit1(
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
      docNo,
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      Date: createValues[0],
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        Date: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test (With Saving) ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await StaffCP38Edit2(
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
      docNo,
    );

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      Date: createValues[0],
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      payrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        Date: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await StaffCP38Delete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
      DocNo: docNo,
      Date: createValues[0],
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
    await editJson(JsonPath, formName, "");
    console.log(`End Tests Running: ${formName}`);
  });
});
