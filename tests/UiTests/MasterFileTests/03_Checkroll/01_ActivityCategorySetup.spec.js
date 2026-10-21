import { test } from "@utils/commonFunctions/GlobalSetup";
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
  validateTreeViewUiValues,
  validateTreeViewDBValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  masterSQLCommand,
  masterTreeViewSQLCommand,
} from "@UiFolder/queries/MasterQuery";
import {
  JsonPath,
  InputPath,
  TreePath,
} from "@utils/data/uidata/masterData.json";

import {
  ActivityCategorySetupCreate,
  ActivityCategorySetupEdit1,
  ActivityCategorySetupEdit2,
  ActivityCategorySetupDelete,
} from "@UiFolder/pages/MasterFile/03_Checkroll/01_ActivityCategorySetupPage";

// ---------------- Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let treeViewCreateValues;
let treeViewEditValues;
let treeViewCheckValues;
let treeViewCheckValuesAfterCreate;
let treeViewCheckValuesAfterEdit;
let deleteSQL;
let phaseCount = 0;
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "Checkroll";
const formName = "Activity Category Setup";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
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
      treeViewCreateValues,
      treeViewEditValues,
      treeViewCheckValues,
    ] = await excel.loadExcelValues(sheetName, formName, { hasTree: true });

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

    const { uiVals, treeViewUiVals } = await ActivityCategorySetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      treeViewPath,
      treeViewCreateValues,
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
    await validateTreeViewUiValues(
      treeViewCheckValuesAfterCreate,
      treeViewUiVals,
    );
    await validateDBValues(uiVals, columns, dbValues[0]);
    await validateTreeViewDBValues(treeViewUiVals, treeViewDbValues);
  });

  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, treeViewUiVals } = await ActivityCategorySetupEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      treeViewPath,
      treeViewEditValues,
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
    await validateTreeViewUiValues(
      treeViewCheckValuesAfterCreate,
      treeViewUiVals,
    );
    await validateDBValues(uiVals, columns, dbValues[0]);
    await validateTreeViewDBValues(treeViewUiVals, treeViewDbValues);
  });

  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, treeViewUiVals } = await ActivityCategorySetupEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      treeViewPath,
      treeViewEditValues,
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
    await validateTreeViewUiValues(
      treeViewCheckValuesAfterEdit,
      treeViewUiVals,
    );
    await validateDBValues(uiVals, columns, dbValues[0]);
    await validateTreeViewDBValues(treeViewUiVals, treeViewDbValues);
  });

  test(`Delete ${formName}`, async ({ page, db }) => {
    await ActivityCategorySetupDelete(page, sideMenu, editValues);
    // Check if the Activity Category code is deleted
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  test.afterAll(async () => {
    console.log(`End Tests Running: ${formName}`);
  });
});
