import { test } from "@playwright/test";
import LoginPage from "../pages/General/LoginPage";
import SideMenuPage from "../pages/General/SideMenuPage";

// Global variable for SideMenuPage
let sideMenu;

test.beforeEach(async ({ page }) => {
  // Login and Navigate to the testing form
  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.navigateToForm(
    "Master File",
    "General",
    "Additional Remuneration Setup"
  );

  // Initialize sideMenu
  sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();
});

test("Create New Additional Remuneration Code", async ({ page }) => {
  await AddRemSetupCreate(page, sideMenu);
});

test("Edit Additional Remuneration Code", async ({ page }) => {
  // TODO()
});

test("Delete Additional Remuneration Code", async ({ page }) => {
  // TODO()
});
