import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import {
  masterSQLCommand,
  masterGridSQLCommand,
} from "@UiFolder/queries/MasterQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
} from "@utils/data/uidata/masterData.json";

import {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
} from "@UiFolder/pages/MasterFile/01_AdditionalRemunerationSetupPage";

// ---------------- Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "General";
const formName = "Additional Remuneration Setup";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2, 3]];

test.describe.serial("Additional Remuneration Setup Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    // Load Excel values
    [
      createValues,
      editValues,
      deleteSQL,
      ou,
      gridCreateValues,
      gridEditValues,
    ] = await excel.loadExcelValues(sheetName, formName, { hasGrid: true });

    await checkLength(paths, columns, createValues, editValues);

    console.log(`Start Running: ${formName}`);
  });

  // ---------------- Before Each  ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Tests ----------------
  test("Create New Additional Remuneration Setup", async ({ page, db }) => {
    await db.deleteData(deleteSQL, {});

    const { uiVals, gridVals } = await AddRemSetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });

    const gridDbValues = await db.retrieveGridData(
      masterGridSQLCommand(formName),
      {
        Code: createValues[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(uiVals, columns, dbValues[0]);
    await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  test("Edit Additional Remuneration Setup", async ({ page, db }) => {
    const { uiVals, gridVals } = await AddRemSetupEdit(
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

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });

    const gridDbValues = await db.retrieveGridData(
      masterGridSQLCommand(formName),
      {
        Code: editValues[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(uiVals, columns, dbValues[0]);
    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  test("Delete Additional Remuneration Setup", async ({ page, db }) => {
    await AddRemSetupDelete(page, sideMenu, editValues);

    // Check if the Additional Remuneration Setup is deleted
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });

    if (dbValues.length > 0) {
      throw new Error(
        "DB validation failed when deleting Additional Remuneration Setup"
      );
    }
  });

  test.afterAll(async () => {
    // Close database connection
    console.log(`End Running: ${formName}`);
  });
});
