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
} from "@UiFolder/queries/VehicleQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/vehicleData.json";

import {
  VehicleRunningDistributionLoanToCreate,
  VehicleRunningDistributionLoanToEdit,
  VehicleRunningDistributionLoanToDelete,
} from "@UiFolder/pages/Vehicle/VehicleRunningDistributionLoanTo";

// ---------------- Set Global Variables ----------------
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
const formName = "Inter-OU Vehicle Running Distribution (Loan To)";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 3],
  [0, 1, 2, 3, 4],
];

test.describe
  .serial("Inter-OU Vehicle Running Distribution (Loan To) Tests", async () => {
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
    ou = (await excel.readExcel(sheetName, formName, "OperatingUnit")).split(
      ";"
    );

    // Clean up existing record if any
    docNo = DocNo[keyName];
    if (docNo) {
      const deleteSQL = await excel.readExcel(sheetName, formName, "DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
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
  test("Create New Inter-OU Vehicle Running Distribution (Loan To)", async ({
    page,
    db,
  }) => {
    const allValues = await VehicleRunningDistributionLoanToCreate(
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

    docNo = await page.locator("#txtVehNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    const dbValues = await db.retrieveData(vehicleSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      vehicleGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, allValues[0]);
    await ValidateDBValues(
      [...createValues, ou[0], ou[1]],
      [...columns, "OU", "ToOU"],
      dbValues[0]
    );
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
  test("Edit Inter-OU Vehicle Running Distribution (Loan To)", async ({
    page,
    db,
  }) => {
    const allValues = await VehicleRunningDistributionLoanToEdit(
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
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      vehicleGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, allValues[0]);
    await ValidateDBValues(
      [...editValues, ou[0], ou[1]],
      [...columns, "OU", "ToOU"],
      dbValues[0]
    );
    await ValidateGridValues(gridEditValues.join(";").split(";"), allValues[1]);
    await ValidateDBValues(
      gridEditValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Inter-OU Vehicle Running Distribution (Loan To)", async ({
    page,
    db,
  }) => {
    await VehicleRunningDistributionLoanToDelete(
      page,
      sideMenu,
      createValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(vehicleSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    if (dbValues.length > 0)
      throw new Error(
        "Deleting Inter-OU Vehicle Running Distribution (Loan To) failed"
      );
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {
    console.log(`End Running: ${formName}`);
  });
});
