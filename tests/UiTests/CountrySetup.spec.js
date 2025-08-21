import { expect, test } from "@playwright/test";
import LoginPage from "../../testsfolders/UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../testsfolders/UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  TOKEN,
  InputPath,
} from "../../testsfolders/UiTestsFolder/uidata/masterData.json";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "../../testsfolders/UiTestsFolder/functions/ValidateValues";
import {
  CountrySetupCreate,
  CountrySetupEdit,
  CountrySetupDelete,
} from "../../testsfolders/UiTestsFolder/pages/MasterFile/CountrySetupPage";
import ConnectExcel from "../../Utils/excel/ConnectExcel";
import DBHelper from "../../testsfolders/UiTestsFolder/uiutils/DBHelper";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;

// API URL
const url = API_URL + "/odata/Country";

// Excel info
const sheetName = "MAS_DATA";
const submodule = "General";
const formName = "Country Setup";
const paths = InputPath.CountrySetupPath.split(",");
const columns = InputPath.CountrySetupColumn.split(",");

// Initialize database connection
let db;

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
    await loginPage.navigateToForm("Master File", submodule, formName);

    // Initialize side menu
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Tests ----------------
  test("Create New Country Code", async ({ page }) => {
    const allValues = await CountrySetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues
    );

    await ValidateUiValues(createValues, allValues).then((isMatch) => {
      if (!isMatch)
        throw new Error("UI validation failed when creating new Country Code");
    });

    const dbValues = await db.retrieveData(formName, {
      Code: createValues[0],
    });

    await ValidateDBValues(createValues, columns, dbValues[0]).then(
      (isMatch) => {
        if (!isMatch)
          throw new Error(
            "DB validation failed when creating new Country Code"
          );
      }
    );
  });

  test("Edit Country Code", async ({ page }) => {
    const allValues = await CountrySetupEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues
    );

    await ValidateUiValues(editValues, allValues).then((isMatch) => {
      if (!isMatch)
        throw new Error("UI validation failed when editing Country Code");
    });

    const dbValues = await db.retrieveData(formName, {
      Code: editValues[0],
    });

    await ValidateDBValues(editValues, columns, dbValues[0]).then((isMatch) => {
      if (!isMatch)
        throw new Error("DB validation failed when editing Country Code");
    });
  });

  test("Delete Country Code", async ({ page }) => {
    await CountrySetupDelete(page, sideMenu, editValues);

    // Check if the country code is deleted
    const dbValues = await db.retrieveData(formName, {
      Code: editValues[0],
    });

    if (dbValues.length > 0) {
      throw new Error("DB validation failed when deleting Country Code");
    }
  });

  test.afterAll(async () => {
    // Close database connection
    await db.close();
  });
});
