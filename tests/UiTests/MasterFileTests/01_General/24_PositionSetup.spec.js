import { test, region } from "@utils/commonFunctions/GlobalSetup";
import { allPhases } from "@utils/data/uidata/globalData.json";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import {
  checkLength,
  setCurrForm,
  setCurrPhase,
  throwTestFailMsg,
} from "@UiFolder/functions/comFuncs";
import {
  validateFormValues,
  validateDBValues,
  validateGridValues,
  validateTreeViewUiValues,
  validateTreeViewDBValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  masterSQLCommand,
  masterGridSQLCommand,
  masterTreeViewSQLCommand,
} from "@UiFolder/queries/MasterQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  TreePath,
} from "@utils/data/uidata/masterData.json";

import {
  PositionSetupCreate,
  PositionSetupEdit1,
  PositionSetupEdit2,
  PositionSetupDelete,
} from "@UiFolder/pages/MasterFile/01_General/24_PositionSetupPage";

// ---------------- Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let gridCreateValues;
let gridEditValues;
let treeViewCreateValues;
let treeViewEditValues;
let treeViewCheckValues;
let treeViewCheckValuesAfterCreate;
let treeViewCheckValuesAfterEdit;
let deleteSQL;
let phaseCount = 0;
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "General";
const formName = "Position Setup";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2, 3, 4]];
const columns = InputPath[keyName + "Column"].split(",");
const treeViewPath = TreePath[keyName + "Tree"].split(",");

test.describe.serial(`${formName} Tests`, () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    // Change Current Form and Phase
    await setCurrForm(formName);
    await setCurrPhase(allPhases[phaseCount]);

    // Load Excel values
    [
      createValues,
      editValues,
      deleteSQL,
      ou,
      gridCreateValues,
      gridEditValues,
      treeViewCreateValues,
      treeViewEditValues,
      treeViewCheckValues,
    ] = await excel.loadExcelValues(sheetName, formName, {
      hasGrid: true,
      hasTree: true,
    });

    await checkLength(paths, columns, createValues, editValues);
    [treeViewCheckValuesAfterCreate, treeViewCheckValuesAfterEdit] =
      treeViewCheckValues.map((val) =>
        typeof val === "string"
          ? val.split(",").map((item) => item.trim())
          : val,
      );

    console.log(`Start Running: ${formName}`);
  });

  // ---------------- Before Each  ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();

    // Update Phase
    phaseCount++;
    await setCurrPhase(allPhases[phaseCount]);
  });

  // ---------------- Create Tests ----------------
  test(`Create ${formName}`, async ({ page, db }) => {
    await db.deleteData(deleteSQL, {});

    const { uiVals, gridVals, treeViewUiVals } = await PositionSetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
      treeViewPath,
      treeViewCreateValues,
      region,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName);

    const treeViewDbValues = await db.retrieveData(
      masterTreeViewSQLCommand(formName),
      {
        Code: createValues[0],
      },
    );
    !treeViewDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Tree View record not found");

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);

    if (region === "IND") {
      const gridDbValues = await db.retrieveGridData(
        masterGridSQLCommand(formName),
        {
          Code: createValues[0],
        },
      );
      !gridDbValues &&
        throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
      const gridDbColumns = Object.keys(gridDbValues[0]);

      await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
      await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
    }

    await validateTreeViewUiValues(
      treeViewCheckValuesAfterCreate,
      treeViewUiVals,
    );
    await validateTreeViewDBValues(treeViewUiVals, treeViewDbValues);
  });

  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals, treeViewUiVals } = await PositionSetupEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
      treeViewPath,
      treeViewEditValues,
      region,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });
    !dbValues && throwTestFailMsg("E1-DB-NF", formName);

    const treeViewDbValues = await db.retrieveData(
      masterTreeViewSQLCommand(formName),
      {
        Code: createValues[0],
      },
    );
    !treeViewDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Tree View record not found");

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);

    if (region === "IND") {
      const gridDbValues = await db.retrieveGridData(
        masterGridSQLCommand(formName),
        {
          Code: createValues[0],
        },
      );
      !gridDbValues &&
        throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
      const gridDbColumns = Object.keys(gridDbValues[0]);

      await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
      await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
    }

    await validateTreeViewUiValues(
      treeViewCheckValuesAfterCreate,
      treeViewUiVals,
    );
    await validateTreeViewDBValues(treeViewUiVals, treeViewDbValues);
  });

  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals, treeViewUiVals } = await PositionSetupEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
      treeViewPath,
      treeViewEditValues,
      region,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    !dbValues && throwTestFailMsg("E2-DB-NF", formName);

    const treeViewDbValues = await db.retrieveData(
      masterTreeViewSQLCommand(formName),
      {
        Code: editValues[0],
      },
    );
    !treeViewDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Tree View record not found");

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);

    if (region === "IND") {
      const gridDbValues = await db.retrieveGridData(
        masterGridSQLCommand(formName),
        {
          Code: editValues[0],
        },
      );
      !gridDbValues &&
        throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");
      const gridDbColumns = Object.keys(gridDbValues[0]);

      await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
      await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
    }

    await validateTreeViewUiValues(
      treeViewCheckValuesAfterEdit,
      treeViewUiVals,
    );
    await validateTreeViewDBValues(treeViewUiVals, treeViewDbValues);
  });

  test(`Delete ${formName}`, async ({ page, db }) => {
    await PositionSetupDelete(page, sideMenu, editValues);
    // Check if the Position code is deleted
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  test.afterAll(async () => {
    console.log(`End Tests Running: ${formName}`);
  });
});
