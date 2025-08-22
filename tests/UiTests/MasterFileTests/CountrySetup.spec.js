import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import { InputPath } from "@utils/data/uidata/masterData.json";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";
import {
  CountrySetupCreate,
  CountrySetupEdit,
  CountrySetupDelete,
} from "@UiFolder/pages/MasterFile/CountrySetupPage";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import { masterSQLCommand } from "@UiFolder/uiutils/MasterQuery";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;
let db;

// Excel info
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "General";
const formName = "Country Setup";
const paths = InputPath.CountrySetupPath.split(",");
const columns = InputPath.CountrySetupColumn.split(",");

test.describe("Country Setup Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll(async () => {
    // Initialize Excel connection
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();

    // Read Excel data once
    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");

    // Initialize database connection
    db = new DBHelper("MY");
    await db.connect();

    // Delete a country code if it exists
    const deleteSQL = await connectExcel.readExcel("DeleteSQL");
    await db.deleteData(deleteSQL);
  });

  // ---------------- Before Each ----------------
  test.beforeEach(async ({ page }) => {
    // Login and navigate to the form
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm(module, submodule, formName);

    // Initialize side menu
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Tests ----------------
  test("@ui Create New Country Code", async ({ page }) => {
    const allValues = await CountrySetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues
    );

    await ValidateUiValues(createValues, allValues);

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });

    await ValidateDBValues(createValues, columns, dbValues[0]);
  });

  test("@ui Edit Country Code", async ({ page }) => {
    const allValues = await CountrySetupEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues
    );

    await ValidateUiValues(editValues, allValues);

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });

    await ValidateDBValues(editValues, columns, dbValues[0]);
  });

  test("@ui Delete Country Code", async ({ page }) => {
    await CountrySetupDelete(page, sideMenu, editValues);

    // Check if the country code is deleted
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });

    if (dbValues.length > 0) {
      throw new Error("DB validation failed when deleting Country Code");
    }
  });

  test.afterAll(async () => {
    // Close database connection
    await db.closeAll();
  });
});
