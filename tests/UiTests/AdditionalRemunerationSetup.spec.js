import { test, expect } from "@playwright/test";
import LoginPage from "../../UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  TOKEN,
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
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "../../UiTestsFolder/functions/ValidateValues";

// Global variable for SideMenuPage
let sideMenu;

// Set API url
const url = API_URL + "/odata/AddRem";

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

test.beforeAll(async ({ request }) => {
  async function deleteIfExists(addRemCode) {
    const response = await request.get(
      `${url}?$filter=AddRemCode+eq+%27${addRemCode}%27`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    expect(response.ok()).toBeTruthy(); // Check if the response is OK
    const dbData = await response.json();

    if (dbData.value.length > 0) {
      const deleteResp = await request.delete(
        `${url}(${dbData.value[0].AddRemKey})`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      expect(deleteResp.ok()).toBeTruthy(); // Check if the delete response is OK
    }
  }
  await deleteIfExists(createValues[0]);
  await deleteIfExists(editValues[0]);
});

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
  const allValues = await AddRemSetupCreate(
    page,
    sideMenu,
    paths,
    columns,
    createValues,
    gridPaths,
    gridCreateValues,
    cellsIndex
  );

  await ValidateUiValues(page, allValues).then((isMatch) => {
    if (!isMatch) {
      throw new Error(
        "UI validation failed when creating new Additional Remuneration Code"
      );
    }
  });

  await ValidateGridValues(page, allValues, gridPaths, cellsIndex).then(
    (isMatch) => {
      if (!isMatch) {
        throw new Error(
          "Grid validation failed when creating new Additional Remuneration Code"
        );
      }
    }
  );
});

test("Edit Additional Remuneration Code", async ({ page }) => {
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
  await AddRemSetupDelete(page, sideMenu, editValues);

  const response = await request.get(
    `${url}?$filter=AddRemCode+eq+%27${editValues[0]}%27`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  expect(response.ok()).toBeTruthy(); // Check if the response is OK
  const dbData = await response.json();

  if (dbData.value.length > 0) {
    throw new Error(
      "Additional Remuneration Code was not deleted successfully"
    );
  }
});
