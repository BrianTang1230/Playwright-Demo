import { test, region } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
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
  InterOUDailyContractWorkCreate,
  InterOUDailyContractWorkEdit,
  InterOUDailyContractWorkDelete,
} from "@UiFolder/pages/Checkroll/InterOUDailyContractWork";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "CR_DATA";
const module = "Checkroll";
const submodule = "Attendance";
const formName = "Inter-OU Daily Contract Work (Loan To)";
const keyName = "InterOUDailyContractWork";
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 4],
  [1, 2, 3, 4, 5, 6],
  [1, 3, 4, 9, 12, 15],
];
const cellsIndexIND = [
  [1, 4, 5, 6, 8],
  [1, 2, 3, 4, 5, 6],
  [1, 3, 4, 6, 9],
];
const interDWCellIndex = region === "IND" ? cellsIndexIND : cellsIndex;

test.describe.skip("Inter-OU Daily Contract Work (Loan To) Tests", async () => {
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
  test("Create New Inter-OU Daily Contract Work (Loan To)", async ({
    page,
    db,
  }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals, gridVals } = await InterOUDailyContractWorkCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      interDWCellIndex,
      ou
    );

    docNo = await editJson(
      JsonPath,
      keyName,
      await page.locator("#txtICWNum").inputValue()
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });
    console.log(dbValues);

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );
    console.log(gridDbValues);

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0], ou[1]],
      [...columns, "OU", "LoanToOU"],
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
  test("Edit Inter-OU Daily Contract Work (Loan To)", async ({ page, db }) => {
    const { uiVals, gridVals } = await InterOUDailyContractWorkEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      interDWCellIndex,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });
    console.log(dbValues);

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );
    console.log(gridDbValues);

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou[0], ou[1]],
      [...columns, "OU", "LoanToOU"],
      dbValues[0]
    );
    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(
      gridEditValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // // ---------------- Delete Test ----------------
  // test("Delete Inter-OU Daily Contract Work (Loan To)", async ({
  //   page,
  //   db,
  // }) => {
  //   await InterOUDailyContractWorkDelete(
  //     page,
  //     sideMenu,
  //     createValues,
  //     ou,
  //     docNo
  //   );

  //   const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
  //     DocNo: docNo,
  //     OU: ou[0],
  //   });

  //   if (dbValues.length > 0) throw new Error(`Deleting ${formName} failed`);
  // });

  // // ---------------- After All ----------------
  // test.afterAll(async ({ db }) => {
  //   if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

  //   console.log(`End Running: ${formName}`);
  // });
});
