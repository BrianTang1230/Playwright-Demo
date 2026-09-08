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
  validateGridValues,
  validateDBValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  checkrollSQLCommand,
  checkrollGridSQLCommand,
} from "@UiFolder/queries/CheckrollQuery";

import {
  InputPath,
  JsonPath,
  DocNo,
  GridPath,
} from "@utils/data/uidata/checkrollData.json";

import {
  MillCPOandPKCreate,
  MillCPOandPKEdit1,
  MillCPOandPKEdit2,
  MillCPOandPKDelete,
} from "@UiFolder/pages/Checkroll/29_MillCPOandPK";

// ---------------- Set Global Variables ----------------
let ou;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
let phaseCount = 0;
const sheetName = "CR_DATA";
const module = "Checkroll";
const submodule = "Miscellaneous";
const formName = "Mill CPO and PK";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2, 3]];

test.describe.skip(`${formName} Tests`, async () => {
  if (region === "IND") test.skip(true);
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
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

    console.log(`${"=".repeat(90)}\nStart Running: ${formName}`);
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

  // ---------------- Create Test ----------------
  test(`Create ${formName}`, async ({ page, db }) => {
    const { uiVals, gridVals } = await MillCPOandPKCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
      ou,
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      FYear: createValues[0],
      Period: createValues[1],
      Div: createValues[2],
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        FYear: createValues[0],
        Period: createValues[1],
        Div: createValues[2],
      },
    );
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);

    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await MillCPOandPKEdit(
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
      gridCreateValues[0],
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      FYear: createValues[0],
      Period: createValues[1],
      Div: createValues[2],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        FYear: createValues[0],
        Period: createValues[1],
        Div: createValues[2],
      },
    );
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);

    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await MillCPOandPKEdit(
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
      gridCreateValues[0],
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      FYear: createValues[0],
      Period: createValues[1],
      Div: createValues[2],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        FYear: createValues[0],
        Period: createValues[1],
        Div: createValues[2],
      },
    );
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);

    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await validateDBValues(gridVals, gridDbColumns, gridDbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await MillCPOandPKDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      FYear: createValues[0],
      Period: createValues[1],
      Div: createValues[2],
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    await db.deleteData(deleteSQL, {
      FYear: createValues[0],
      Period: createValues[1],
      Div: createValues[2],
      OU: ou[0],
    });
    await editJson(JsonPath, formName, "");
    console.log(`End Tests Running: ${formName}\n${"=".repeat(90)}`);
  });
});
