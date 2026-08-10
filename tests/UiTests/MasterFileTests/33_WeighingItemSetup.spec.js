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
} from "@UiFolder/functions/valuesFuncs";

import { masterSQLCommand } from "@UiFolder/queries/MasterQuery";
import { JsonPath, InputPath } from "@utils/data/uidata/masterData.json";

import {
  WeighingItemSetupCreate,
  WeighingItemSetupEdit1,
  WeighingItemSetupEdit2,
  WeighingItemSetupDelete,
} from "@UiFolder/pages/MasterFile/33_WeighingItemSetupPage";

// ---------------- Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let phaseCount = 0;
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "General";
const formName = "Weighing Item Setup";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial(`${formName} Tests`, () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    // Change Current Form and Phase
    await setCurrForm(formName);
    await setCurrPhase(allPhases[phaseCount]);

    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName,
      {},
    );

    await checkLength(paths, columns, createValues, editValues);

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

    const { uiVals } = await WeighingItemSetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);
  });

  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals } = await WeighingItemSetupEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });
    !dbValues && throwTestFailMsg("E1-DB-NF", formName);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);
  });

  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals } = await WeighingItemSetupEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    !dbValues && throwTestFailMsg("E2-DB-NF", formName);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);
  });

  test(`Delete ${formName}`, async ({ page, db }) => {
    await WeighingItemSetupDelete(page, sideMenu, editValues);

    // Check if the Weighing Item code is deleted
    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  test.afterAll(async () => {
    console.log(`End Tests Running: ${formName}`);
  });
});
