import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import { InputPath, GridPath } from "@utils/data/uidata/vehicleData.json";
import {
  vehicleGridSQLCommand,
  vehicleSQLCommand,
} from "@UiFolder/uiutils/VehicleQuery";

import { VehicleRunningDistributionCreate } from "@UiFolder/pages/Vehicle/VehicleRunningDistribution";

// ---------------- Set Global Variables ----------------
let db;
let ou;
let sideMenu;
let connectExcel;
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
  test.beforeAll("Setup Excel, DB, and initial data", async () => {
    // Init Excel + DB
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();
    db = new DBHelper();
    await db.connect();

    // Read Excel values
    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");
    gridCreateValues = (await connectExcel.readExcel("GridDataCreate")).split(
      "|"
    );
    gridEditValues = (await connectExcel.readExcel("GridDataEdit")).split("|");
    ou = await connectExcel.readExcel("OperatingUnit");

    // Clean up existing record if any
    const deleteSQL = await connectExcel.readExcel("DeleteSQL");
    await db.deleteData(deleteSQL);
  });

  // ---------------- Before Each  ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Test ----------------
  test("Create New Vehicle Running Distribution", async ({ page }) => {
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

    await ValidateUiValues(createValues, columns, allValues[0]);
    await ValidateGridValues(
      gridCreateValues.join(";").split(";"),
      allValues[1]
    );

    // // Retrieve DB values(ui)
    // const dbValues = await db.retrieveData(vehicleSQLCommand(formName), {
    //   Code: createValues[0],
    // });

    // // Validate DB values(ui)
    // await ValidateDBValues(createValues, columns, dbValues[0]);

    //   // Retrieve DB values(grid)
    //   const gridDbValues = await db.retrieveGridData(
    //     vehicleGridSQLCommand(formName),
    //     {
    //       Code: createValues[0],
    //     }
    //   );

    //   for (let i = 0; i < gridDbValues.length; i++) {
    //     // Get db values columns
    //     const gridDbColumns = Object.keys(gridDbValues[i]);
    //     // Validate DB values(grid)
    //     await ValidateDBValues(
    //       gridCreateValues[i].split(";"),
    //       gridDbColumns,
    //       gridDbValues[i]
    //     );
    //   }
  });
});
