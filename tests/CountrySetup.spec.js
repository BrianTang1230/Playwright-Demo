import { test } from "@playwright/test";
import LoginPage from "../pages/General/LoginPage";
import navigateToForm from "../functions/NavigateToForm";
import SideMenuPage from "../pages/General/SideMenuPage";
import {
  countrySetupCreate,
  countrySetupEdit,
  countrySetupDelete,
} from "../pages/MasterFile/CountrySetupPage";

// Global variable for SideMenuPage
let sideMenu;

test.beforeEach(async ({ page }) => {
  // Login
  const loginPage = new LoginPage(page);
  await loginPage.login();

  // Navigate to the testing form
  await navigateToForm(page, "Master File", "General", "Country Setup");

  // Initialize sideMenu
  sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();
});

test("Create New Country Code", async ({ page }) => {
  await countrySetupCreate(page, sideMenu);
});

test("Edit Country Code", async ({ page }) => {
  await countrySetupEdit(page, sideMenu);
});

test("Delete Country Code", async ({ page }) => {
  await countrySetupDelete(page, sideMenu);
});
