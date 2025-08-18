import { test, expect } from "@playwright/test";
import LoginPage from "../../UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  TOKEN,
  InputPath,
  GridPath,
} from "../../UiTestsFolder/data/masterData.json";
import {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
} from "../../UiTestsFolder/pages/MasterFile/AdditionalRemunerationSetupPage";
import {
  ValidateUiValues,
  ValidateGridValues,
} from "../../UiTestsFolder/functions/ValidateValues";
import ConnectExcel from "../../UiTestsFolder/pages/General/ConnectExcel";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;
let gridCreateValues;
let gridEditValues;

// API URL
const url = API_URL + "/odata/AddRem";

// Excel info
const sheetName = "MAS_DATA";
const submodule = "General";
const formName = "Additional Remuneration Setup";
const paths = InputPath.AddRemSetupPath.split(",");
const columns = InputPath.AddRemSetupColumn.split(",");
const gridPaths = GridPath.AddRemSetupGrid.split(",");
const cellsIndex = [1, 2, 3];

test.describe("Additional Remuneration Setup Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll(async ({ request }) => {
    // Initialize Excel helper
    connectExcel = new ConnectExcel();
    await connectExcel.init();

    // Read Excel data once
    createValues = (
      await connectExcel.readExcel(sheetName, formName, "CreateData")
    ).split(";");
    editValues = (
      await connectExcel.readExcel(sheetName, formName, "EditData")
    ).split(";");
    gridCreateValues = (
      await connectExcel.readExcel(sheetName, formName, "GridDataCreate")
    ).split("|");
    gridEditValues = (
      await connectExcel.readExcel(sheetName, formName, "GridDataEdit")
    ).split("|");

    // Delete existing data if present
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
      expect(response.ok()).toBeTruthy();

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
        expect(deleteResp.ok()).toBeTruthy();
      }
    }

    await deleteIfExists(createValues[0]);
    await deleteIfExists(editValues[0]);
  });

  // ---------------- Before Each ----------------
  test.beforeEach(async ({ page }) => {
    // Login and navigate to form
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm("Master File", submodule, formName);

    // Initialize side menu
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Tests ----------------
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

    // Validate UI fields
    await ValidateUiValues(page, allValues).then((isMatch) => {
      if (!isMatch)
        throw new Error(
          "UI validation failed when creating new Additional Remuneration Code"
        );
    });

    // Validate grid fields
    await ValidateGridValues(page, allValues, gridPaths, cellsIndex).then(
      (isMatch) => {
        if (!isMatch)
          throw new Error(
            "Grid validation failed when creating new Additional Remuneration Code"
          );
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
    expect(response.ok()).toBeTruthy();

    const dbData = await response.json();
    if (dbData.value.length > 0)
      throw new Error(
        "Additional Remuneration Code was not deleted successfully"
      );
  });
});