import { test } from "@UiFolder/functions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/pages/General/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import {
  vehicleGridSQLCommand,
  vehicleSQLCommand,
} from "@UiFolder/uiutils/VehicleQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/vehicleData.json";

import {
  VehicleRunningDistributionCreate,
  VehicleRunningDistributionDelete,
  VehicleRunningDistributionEdit,
} from "@UiFolder/pages/Vehicle/VehicleRunningDistribution";

// ---------------- Set Global Variables ----------------
let db;
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let gridCreateValues;
let gridEditValues;
const sheetName = "VEH_DATA";
const module = "Vehicle";
const submodule = null;
const formName = "Vehicle Running Distribution";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 3],
  [0, 1, 2, 3, 4],
];

test.describe.serial("Vehicle Running Distribution Tests", async () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Read Excel values
    createValues = (
      await excel.readExcel(sheetName, formName, "CreateData")
    ).split(";");
    editValues = (await excel.readExcel(sheetName, formName, "EditData")).split(
      ";"
    );
    gridCreateValues = (
      await excel.readExcel(sheetName, formName, "GridDataCreate")
    ).split("|");
    gridEditValues = (
      await excel.readExcel(sheetName, formName, "GridDataEdit")
    ).split("|");
    ou = await excel.readExcel(sheetName, formName, "OperatingUnit");

    // Clean up existing record if any
    docNo = DocNo[keyName];
    if (docNo) {
      const deleteSQL = await excel.readExcel(sheetName, formName, "DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou });
    }

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
  test("Create New Vehicle Running Distribution", async ({ page, db }) => {
    const allValues = await VehicleRunningDistributionCreate(
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

    docNo = await page.locator("#txtVEHNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    const dbValues = await db.retrieveData(vehicleSQLCommand(formName), {
      DocNo: docNo,
      OU: ou,
    });

    const gridDbValues = await db.retrieveGridData(
      vehicleGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou,
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, allValues[0]);
    await ValidateDBValues(createValues, columns, dbValues[0]);
    await ValidateGridValues(
      gridCreateValues.join(";").split(";"),
      allValues[1]
    );
    await ValidateDBValues(
      gridCreateValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Vehicle Running Distribution", async ({ page, db }) => {
    const allValues = await VehicleRunningDistributionEdit(
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

    const dbValues = await db.retrieveData(vehicleSQLCommand(formName), {
      DocNo: docNo,
      OU: ou,
    });

    const gridDbValues = await db.retrieveGridData(
      vehicleGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou,
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, allValues[0]);
    await ValidateDBValues(editValues, columns, dbValues[0]);
    await ValidateGridValues(gridEditValues.join(";").split(";"), allValues[1]);
    await ValidateDBValues(
      gridEditValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Vehicle Running Distribution", async ({ page, db }) => {
    await VehicleRunningDistributionDelete(
      page,
      sideMenu,
      createValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(vehicleSQLCommand(formName), {
      DocNo: docNo,
      OU: ou,
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Vehicle Running Distribution failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {
    console.log(`End Running: ${formName}`);
  });
});
