import { test, expect } from "@playwright/test";
import LoginPage from "../pages/Login";
import navigateToForm from "../functions/NavigateToForm";
import SideMenuPage from "../pages/SideMenu";
import { InputPath, CreateData, EditData } from "../data/masterData.json";
import InputValues from "../functions/InputValues";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
});

test("Create New Country Code", async ({ page }) => {
  await navigateToForm(page, "Master File", "Country Setup", "General");

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
});

// test("Edit New Country Code", async ({ page }) => {
//   await navigateToForm(page, "Master File", "Country Setup", "General");

//   const sideMenu = new SideMenuPage(page);
//   await sideMenu.sideMenuBar.waitFor();
//   await sideMenu.btnNew.click();

//   // Define Elements and Values
//   const paths = InputPath.CountrySetupPath.split(",");
//   const columns = InputPath.CountrySetupColumn.split(",");
//   const values = EditData.CountrySetupData.split(",");

//   // Input Data
//   if (paths.length == columns.length && columns.length == values.length) {
//     for (let i = 0; i < paths.length; i++) {
//       await InputValues(page, paths[i], columns[i], values[i]);
//     }
//   }

//   // Save Edit
//   await sideMenu.btnSave.click();
// });
