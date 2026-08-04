import { test, region } from "@utils/commonFunctions/GlobalSetup";
import { allPhases } from "@utils/data/uidata/globalData.json";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import {
  setCurrForm,
  setCurrPhase,
  checkLength,
  throwTestFailMsg,
} from "@UiFolder/functions/comFuncs";
import {
  validateFormValues,
  validateDBValues,
  validateGridValues,
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
  DailyAttendanceCreate,
  DailyAttendanceEdit1,
  DailyAttendanceEdit2,
  DailyAttendanceDelete,
} from "@UiFolder/pages/Checkroll/01_DailyAttendance";

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
const sheetName = "CR_Data";
const module = "Checkroll";
const submodule = "Attendance";
const formName = "Daily Attendance";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 3, 4, 6, 7],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15],
];
const cellsIndexIND = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
];

const dwCellIndex = region === "IND" ? cellsIndexIND : cellsIndex;
const dwCols = region === "IND" ? columns.slice(0, 4) : columns;
const dwPaths = region === "IND" ? paths.slice(0, 4) : paths;

test.describe.serial(`${formName} Tests`, () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
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

    await checkLength(dwPaths, dwCols, createValues, editValues);

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
    const { uiVals, gridVals } = await DailyAttendanceCreate(
      page,
      sideMenu,
      dwPaths,
      dwCols,
      createValues,
      gridPaths,
      gridCreateValues,
      dwCellIndex,
      ou,
    );

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtATRNum").inputValue(),
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] },
    );
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, dwCols, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);

    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  //---------------- Edit Test (With Saving) ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await DailyAttendanceEdit1(
      page,
      sideMenu,
      dwPaths,
      dwCols,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      dwCellIndex,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] },
    );
    !gridDbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);

    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await DailyAttendanceEdit2(
      page,
      sideMenu,
      dwPaths,
      dwCols,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      dwCellIndex,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] },
    );
    !gridDbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, dwCols, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);

    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await DailyAttendanceDelete(
      page,
      sideMenu,
      createValues,
      editValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
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
