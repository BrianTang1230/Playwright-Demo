import { test, expect } from "@playwright/test";
import LoginPage from "../../testsfolders/UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../testsfolders/UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  TOKEN,
  InputPath,
  GridPath,
} from "../../testsfolders/UiTestsFolder/uidata/masterData.json";
import {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
} from "../../testsfolders/UiTestsFolder/pages/MasterFile/AdditionalRemunerationSetupPage";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "../../testsfolders/UiTestsFolder/functions/ValidateValues";
import ConnectExcel from "../../utils/excel/ConnectExcel";
import DBHelper from "../../UiTestsFolder/Utils/DBHelper";

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

//
let db;

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

    // Initialize database connection
    db = new DBHelper("MY");
    await db.connect();

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

    // Retrieve DB values(ui)
    const dbValues = await db.retrieveData("Additional Remuneration Setup", {
      Code: createValues[0],
    });

    // Validate DB values(ui)
    await ValidateDBValues(createValues, columns, dbValues[0]).then(
      (isMatch) => {
        if (!isMatch)
          throw new Error(
            "DB validation failed when creating new Additional Remuneration Code"
          );
      }
    );

    // Retrieve DB values(grid)
    const gridDbValues = await db.retrieveGridData(
      "Additional Remuneration Setup",
      {
        Code: createValues[0],
      }
    );

    for (let i = 0; i < gridDbValues.length; i++) {
      // Get db values columns
      const gridDbColumns = Object.keys(gridDbValues[i]);
      // Validate DB values(grid)
      await ValidateDBValues(
        gridCreateValues[i].split(";"),
        gridDbColumns,
        gridDbValues[i]
      ).then((isMatch) => {
        if (!isMatch)
          throw new Error(
            "DB validation failed when creating new Additional Remuneration Code"
          );
      });
    }
  });

  test("Edit Additional Remuneration Code", async ({ page }) => {
    const allValues = await AddRemSetupEdit(
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

    // Retrieve DB values(ui)
    const dbValues = await db.retrieveData("Additional Remuneration Setup", {
      Code: editValues[0],
    });

    // Validate DB values(ui)
    await ValidateDBValues(editValues, columns, dbValues[0]).then((isMatch) => {
      if (!isMatch)
        throw new Error(
          "DB validation failed when editing Additional Remuneration Code"
        );
    });

    // Retrieve DB values(grid)
    const gridDbValues = await db.retrieveGridData(
      "Additional Remuneration Setup",
      {
        Code: editValues[0],
      }
    );

    for (let i = 0; i < gridDbValues.length; i++) {
      // Get db values columns
      const gridDbColumns = Object.keys(gridDbValues[i]);
      // Validate DB values(grid)
      await ValidateDBValues(
        gridEditValues[i].split(";"),
        gridDbColumns,
        gridDbValues[i]
      ).then((isMatch) => {
        if (!isMatch)
          throw new Error(
            "DB validation failed when editing Additional Remuneration Code"
          );
      });
    }
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