import { test, region } from "@utils/commonFunctions/GlobalSetup";
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
  DailyAttendanceCreate,
  DailyAttendanceDelete,
  DailyAttendanceEdit,
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

test.describe.serial("Daily Attendance Tests", () => {
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

    await checkLength(dwPaths, dwCols, createValues, editValues);

    docNo = DocNo[keyName];

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
  test("Create Daily Attendance", async ({ page, db }) => {
    await db.deleteData(deleteSQL, {
      DocNo: docNo,
      OU: ou[0],
    });

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

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] },
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateFormValues(createValues, dwCols, uiVals);
    await ValidateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);

    await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test("Edit Daily Attendance", async ({ page, db }) => {
    const { uiVals, gridVals } = await DailyAttendanceEdit(
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

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] },
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateFormValues(editValues, dwCols, uiVals);
    await ValidateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);

    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test("Delete Daily Attendance", async ({ page, db }) => {
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

    if (dbValues.length > 0) throw new Error(`Deleting ${formName} failed`);

    console.log("\n" + `${formName} transaction deleted successfully!` + "\n");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    console.log(`End Running: ${formName}`);
  });
});
