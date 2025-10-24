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
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/ffbData.json";

import {
  FFBAdvancePaymentCreate,
  FFBAdvancePaymentDelete,
  FFBAdvancePaymentEdit,
} from "@UiFolder/pages/FFBProcurement/07_FFBAdvancePayment";

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
const sheetName = "FFB_DATA";
const module = "FFB Procurement";
const submodule = null;
const formName = "FFB Advance Payment";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1], [3, 5, 6, 12, 13, 14, 15]];

test.describe.serial("FFB Advance Payment Tests", () => {
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
  test("Create New FFB Advance Payment", async ({ page, db }) => {
    if (docNo)
      await db.deleteData(deleteSQL, {
        DocNo: docNo,
      });

    const { uiVals, gridVals } = await FFBAdvancePaymentCreate(
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
      formName,
      await page.locator("#AdvPayNo").inputValue()
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      DocNo: docNo,
    });

    const gridDbValues = await db.retrieveGridData(
      ffbGridSQLCommand(formName),
      {
        DocNo: docNo,
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
  test("Edit FFB Advance Payment", async ({ page, db }) => {
    const { uiVals, gridVals } = await FFBAdvancePaymentEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridCreateValues,
      gridEditValues,
      cellsIndex,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      DocNo: docNo,
    });

    const gridDbValues = await db.retrieveGridData(
      ffbGridSQLCommand(formName),
      {
        DocNo: docNo,
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
  test("Delete FFB Advance Payment", async ({ page, db }) => {
    await FFBAdvancePaymentDelete(
      page,
      sideMenu,
      createValues,
      gridEditValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(ffbSQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0)
      throw new Error("Deleting FFB Advance Payment failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo)
      await db.deleteData(deleteSQL, {
        DocNo: docNo,
      });

    console.log(`End Running: ${formName}`);
  });
});
