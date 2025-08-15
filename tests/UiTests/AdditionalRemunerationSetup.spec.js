import { test } from "@playwright/test";
import LoginPage from "../../UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  InputPath,
  GridPath,
  CreateData,
  CreateGridData,
  EditData,
  EditGridData,
} from "../../UiTestsFolder/data/masterData.json";
import {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
} from "../../UiTestsFolder/pages/MasterFile/AdditionalRemunerationSetupPage";
import {
  ValidateValues,
  ValidateGridValues,
  ValidateDBValues,
} from "../../UiTestsFolder/functions/ValidateValues";

// Global variable for SideMenuPage
let sideMenu;

// Default elements and values for creation
const paths = InputPath.AddRemSetupPath.split(",");
const columns = InputPath.AddRemSetupColumn.split(",");
const createValues = CreateData.AddRemSetupData.split(",");
const editValues = EditData.AddRemSetupData.split(",");

// Default grid elements and values for creation
const gridPaths = GridPath.AddRemSetupGrid.split(",");
const gridCreateValues = CreateGridData.AddRemSetupGridData.split(";");
const gridEditValues = EditGridData.AddRemSetupGridData.split(";");
const cellsIndex = [1, 2, 3];

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

test("Create New Additional Remuneration Code", async ({ page, request }) => {
  const uIValues = await AddRemSetupCreate(
    page,
    sideMenu,
    paths,
    columns,
    createValues,
    gridPaths,
    gridCreateValues,
    cellsIndex
  );

  await ValidateValues(page, uIValues, paths);
  await ValidateGridValues(page, gridCreateValues, gridPaths, cellsIndex);
});

test("Edit Additional Remuneration Code", async ({ page, request }) => {
  await AddRemSetupEdit(
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
});

test("Delete Additional Remuneration Code", async ({ page, request }) => {
  await AddRemSetupDelete(page, sideMenu);
});
