import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import { InputPath, GridPath } from "@utils/data/uidata/masterData.json";
import {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
} from "@UiFolder/pages/MasterFile/AdditionalRemunerationSetupPage";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import {
  masterGridSqlCommand,
  masterSQLCommand,
} from "@UiFolder/uiutils/MasterQuery";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;
let gridCreateValues;
let gridEditValues;
let db;

// Excel info
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "General";
const formName = "Additional Remuneration Setup";
const paths = InputPath.AddRemSetupPath.split(",");
const columns = InputPath.AddRemSetupColumn.split(",");
const gridPaths = GridPath.AddRemSetupGrid.split(",");
const cellsIndex = [1, 2, 3];

test.describe("Additional Remuneration Setup Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll(async () => {
    // Initialize Excel helper
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();

    // Read Excel data once
    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");
    gridCreateValues = (await connectExcel.readExcel("GridDataCreate")).split(
      "|"
    );
    gridEditValues = (await connectExcel.readExcel("GridDataEdit")).split("|");

    // Initialize database connection
    db = new DBHelper("MY");
    await db.connect();

    // Delete existing data if present
    const deleteSQL = await connectExcel.readExcel("DeleteSQL");
    await db.deleteData(deleteSQL);
  });

  // ---------------- Before Each ----------------
  test.beforeEach(async ({ page }) => {
    // Login and navigate to form
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm(module, submodule, formName);

    // Initialize side menu
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Tests ----------------
  test("Create New Additional Remuneration Code", async ({ page }) => {
    const allValues = await AddRemSetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex
    );

    // Validate UI fields
    await ValidateUiValues(page, allValues);

    // Validate grid fields
    await ValidateGridValues(page, allValues, gridPaths, cellsIndex);

    // Retrieve DB values(ui)
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });

    // Validate DB values(ui)
    await ValidateDBValues(createValues, columns, dbValues[0]);

    // Retrieve DB values(grid)
    const gridDbValues = await db.retrieveGridData(
      masterGridSqlCommand(formName),
      {
        Code: createValues[0],
      }
    );

    for (let i = 0; i < gridDbValues.length; i++) {
      // Get db values columns
      const gridDbColumns = Object.keys(gridDbValues[i]);
      // Validate DB values(grid)
      await ValidateDBValues(
        gridCreateValues[i].split(";"),
        gridDbColumns,
        gridDbValues[i]
      );
    }
  });

  test("Edit Additional Remuneration Code", async ({ page }) => {
    const allValues = await AddRemSetupEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex
    );

    // Validate UI fields
    await ValidateUiValues(page, allValues);

    // Validate grid fields
    await ValidateGridValues(page, allValues, gridPaths, cellsIndex);

    // Retrieve DB values(ui)
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });

    // Validate DB values(ui)
    await ValidateDBValues(editValues, columns, dbValues[0]);

    // Retrieve DB values(grid)
    const gridDbValues = await db.retrieveGridData(
      masterGridSqlCommand(formName),
      {
        Code: editValues[0],
      }
    );

    for (let i = 0; i < gridDbValues.length; i++) {
      // Get db values columns
      const gridDbColumns = Object.keys(gridDbValues[i]);
      // Validate DB values(grid)
      await ValidateDBValues(
        gridEditValues[i].split(";"),
        gridDbColumns,
        gridDbValues[i]
      );
    }
  });

  test("Delete Additional Remuneration Code", async ({ page }) => {
    await AddRemSetupDelete(page, sideMenu, editValues);

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });

    if (dbValues.length > 0) {
      throw new Error(
        "DB validation failed when deleting Additional Remuneration Code"
      );
    }
  });

  test.afterAll(async () => {
    // Close database connection
    await db.closeAll();
  });
});
