import { test } from "@utils/commonFunctions/GlobalSetup";
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
  weighbridgeGridSQLCommand,
  weighbridgeSQLCommand,
} from "@UiFolder/queries/WeighbridgeQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
} from "@utils/data/uidata/weighbridgeData.json";

import {
  DailyTotalCropReceiptByCropSupplierCreate,
  DailyTotalCropReceiptByCropSupplierDelete,
  DailyTotalCropReceiptByCropSupplierEdit,
} from "@UiFolder/pages/Weighbridge/01_DailyTotalCropReceiptByCropSupplier";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "WEIGH_DATA";
const module = "Weighbridge";
const submodule = null;
const formName = "Daily Total Crop Receipt by Crop Supplier";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1], [0, 4, 5, 6, 7, 8]];

test.describe
  .serial("Daily Total Crop Receipt by Crop Supplier Tests", async () => {
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
  test("Create New Daily Total Crop Receipt by Crop Supplier", async ({
    page,
    db,
  }) => {
    await db.deleteData(deleteSQL, { Date: createValues[0], OU: ou[0] });

    const { uiVals, gridVals } =
      await DailyTotalCropReceiptByCropSupplierCreate(
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

    const dbValues = await db.retrieveData(weighbridgeSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      weighbridgeGridSQLCommand(formName),
      {
        Date: createValues[0],
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
  test("Edit Daily Total Crop Receipt by Crop Supplier", async ({
    page,
    db,
  }) => {
    const { uiVals, gridVals } = await DailyTotalCropReceiptByCropSupplierEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
      ou
    );

    const dbValues = await db.retrieveData(weighbridgeSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      weighbridgeGridSQLCommand(formName),
      {
        Date: createValues[0],
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
  test("Delete Daily Total Crop Receipt by Crop Supplier", async ({
    page,
    db,
  }) => {
    await DailyTotalCropReceiptByCropSupplierDelete(
      page,
      sideMenu,
      createValues,
      ou
    );

    const dbValues = await db.retrieveData(weighbridgeSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    if (dbValues.length > 0)
      throw new Error(
        "Deleting Daily Total Crop Receipt by Crop Supplier failed"
      );
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    console.log(`End Running: ${formName}`);
  });
});
