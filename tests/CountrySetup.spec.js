import { test, expect } from "@playwright/test";
import LoginPage from "../functions/Login";
import navigateToForm from "../functions/NavigateToForm";
import SideMenuPage from "../functions/SideMenu";
import { InputPath, CreateData, EditData } from "../data/masterData.json";

test("Create New Country Code", async ({ page }) => {
  
  await navigateToForm(page, "Master File", "Country Setup", "General");

  const sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();
  await sideMenu.btnNew.click();

  // Input Data
  const paths = InputPath.CountrySetupPath.split(",");
  const columns = InputPath.CountrySetupColumn.split(",");
  const dataArr = CreateData.CountrySetupData.split(",");

  if (paths.length == columns.length && columns.length == dataArr.length) {
    for (let i = 0; i < paths.length; i++) {}
  }
});

// test("Edit New Country Code", async ({ page }) => {
//   await login(page);

//   await OpenModule(page, "Master File", "General");

//   await OpenForm("Country Setup");

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });
