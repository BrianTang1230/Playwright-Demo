import { test, expect } from "@playwright/test";
import LoginPage from "../pages/Login";
import navigateToForm from "../functions/NavigateToForm";
import SideMenuPage from "../pages/SideMenu";
import { InputPath, CreateData, EditData } from "../data/masterData.json";
import InputValues from "../functions/InputValues";
import selectTransaction from "../functions/GetTransaction";

test.beforeEach(async ({ page }) => {
  // Login
  const loginPage = new LoginPage(page);
  await loginPage.login();

  // Navigate to the Testing Form
  await navigateToForm(page, "Master File", "General", "Country Setup");
});

test("Create New Country Code", async ({ page }) => {
  const sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();
  await sideMenu.btnNew.click();

  // Define Elements and Values
  const paths = InputPath.CountrySetupPath.split(",");
  const columns = InputPath.CountrySetupColumn.split(",");
  const values = CreateData.CountrySetupData.split(",");

  // Input Data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  }

  // Save Create
  await sideMenu.btnSave.click();

  // Search and Select
  await selectTransaction(page, values, "search");

  // Get Ui values
  await sideMenu.btnEdit.click();

  // Compare Input Values with Ui Values
});

test("Edit New Country Code", async ({ page }) => {
  const sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();

  // Define Old Values to Find Created Transaction
  const values = CreateData.CountrySetupData.split(",");
  await selectTransaction(page, values, "search");
  await sideMenu.btnEdit.click();

  // Define Elements and New Values
  const paths = InputPath.CountrySetupPath.split(",");
  const columns = InputPath.CountrySetupColumn.split(",");
  const newValues = EditData.CountrySetupData.split(",");

  // Input New Data
  if (
    paths.length == columns.length &&
    columns.length == values.length &&
    values.length == newValues.length
  ) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  }

  // Save Edit
  await sideMenu.btnSave.click();

  // Search and Select
  await selectTransaction(page, newValues, "search");

  // Get Ui values
  await sideMenu.btnEdit.click();

  // Compare Input Values with Ui Values
});

test("Delete Country Code", async ({ page }) => {
  const sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();

  // Define Lastest Values
  const values = EditData.CountrySetupData.split(",");

  // Search and Select
  await selectTransaction(page, values, "search");

  // Click to Delete
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
});
