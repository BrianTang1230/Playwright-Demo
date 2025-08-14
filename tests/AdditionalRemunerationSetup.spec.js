import { test } from "@playwright/test";
import LoginPage from "../pages/General/LoginPage";
import navigateToForm from "../functions/NavigateToForm";
import SideMenuPage from "../pages/General/SideMenuPage";

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
  // TODO()
});

test("Edit Country Code", async ({ page }) => {
  // TODO()
});

test("Delete Country Code", async ({ page }) => {
  // TODO()
});
