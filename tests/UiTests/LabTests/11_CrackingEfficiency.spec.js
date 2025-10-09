import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateDBValues,
  ValidateGridValues,
} from "@UiFolder/functions/ValidateValues";

import { labSQLCommand, labGridSQLCommand } from "@UiFolder/queries/LabQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/labData.json";

import {
  LabCommonPageCreate,
  LabCommonPageDelete,
  LabCommonPageEdit,
} from "@UiFolder/pages/Lab/LabCommonPage";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "LAB_DATA";
const module = "Lab";
const submodule = null;
const formName = "Cracking Efficiency";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[module + "Grid"].split(",");
const cellsIndex = [
  [1, 3],
  [0, 12, 13, 14, 15, 16, 17],
];

test.describe.serial("Cracking Efficiency Tests", async () => {
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

  // ---------------- Create Test ----------------
  test("Create New Cracking Efficiency", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { Date: createValues[0], OU: ou[0] });

    const { uiVals, gridVals } = await LabCommonPageCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
      ou
    );

    const dbValues = await db.retrieveData(labSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      labGridSQLCommand(formName),
      {
        Date: createValues[0],
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0]],
      [...columns, "OU"],
      dbValues[0]
    );
    await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await ValidateDBValues(
      gridCreateValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Cracking Efficiency", async ({ page, db }) => {
    const { uiVals, gridVals } = await LabCommonPageEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
      ou,
      gridCreateValues[0].split(";")[0]
    );

    const dbValues = await db.retrieveData(labSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      labGridSQLCommand(formName),
      {
        Date: createValues[0],
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou[0]],
      [...columns, "OU"],
      dbValues[0]
    );
    await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await ValidateDBValues(
      gridEditValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Cracking Efficiency", async ({ page, db }) => {
    await LabCommonPageDelete(
      page,
      sideMenu,
      createValues,
      ou,
      gridEditValues[0].split(";")[0]
    );

    const dbValues = await db.retrieveData(labSQLCommand(formName), {
      Date: createValues[0],
      OU: ou[0],
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Cracking Efficiency failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    console.log(`End Running: ${formName}`);
  });
});
