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
  validateGridValues,
} from "@UiFolder/functions/valuesFuncs";

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
  ActivityCodeSetupSetupCreate,
  ActivityCodeSetupSetupEdit1,
  ActivityCodeSetupSetupEdit2,
  ActivityCodeSetupSetupDelete,
} from "@UiFolder/pages/MasterFile/03_Checkroll/02_ActivityCodeSetupPage";

// ---------------- Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
let phaseCount = 0;
const sheetName = "MAS_DATA";
const module = "Master File";
const submodule = "Checkroll";
const formName = "Activity Code Setup";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2, 3, 4]];

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

    // Update Phase
    phaseCount++;
    await setCurrPhase(allPhases[phaseCount]);
  });

  // ---------------- Create Tests ----------------
  test(`Create ${formName}`, async ({ page, db }) => {
    await db.deleteData(deleteSQL, {});

    const { uiVals, gridVals } = await ActivityCodeSetupSetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      masterGridSQLCommand(formName),
      {
        Code: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await ActivityCodeSetupSetupEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: createValues[0],
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      masterGridSQLCommand(formName),
      {
        Code: createValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await ActivityCodeSetupSetupEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      gridPaths,
      gridEditValues,
      cellsIndex,
    );

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");
    const gridDbValues = await db.retrieveGridData(
      masterGridSQLCommand(formName),
      {
        Code: editValues[0],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues(uiVals, columns, dbValues[0]);
    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  test(`Delete ${formName}`, async ({ page, db }) => {
    await ActivityCodeSetupSetupDelete(page, sideMenu, editValues);

    const dbValues = await db.retrieveData(masterSQLCommand(formName), {
      Code: editValues[0],
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  test.afterAll(async () => {
    console.log(`End Tests Running: ${formName}`);
  });
});
