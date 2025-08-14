import { test } from "@playwright/test";
import LoginPage from "../pages/General/LoginPage";
import SideMenuPage from "../pages/General/SideMenuPage";
import {
  CountrySetupCreate,
  CountrySetupEdit,
  CountrySetupDelete,
} from "../pages/MasterFile/CountrySetupPage";

// Global variable for SideMenuPage
let sideMenu;

test.beforeEach(async ({ page }) => {
  // Login and Navigate to the testing form
  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.navigateToForm("Master File", "General", "Country Setup");

  // Initialize sideMenu
  sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();
});

test("Create New Country Code", async ({ page }) => {
  await CountrySetupCreate(page, sideMenu);
});

test("Edit Country Code", async ({ page }) => {
  await CountrySetupEdit(page, sideMenu);
});

test("Delete Country Code", async ({ page }) => {
  await CountrySetupDelete(page, sideMenu);
});
