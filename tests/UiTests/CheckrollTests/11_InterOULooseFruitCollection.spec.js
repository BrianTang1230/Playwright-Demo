import { test, region } from "@utils/commonFunctions/GlobalSetup";
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
  checkrollSQLCommand,
  checkrollGridSQLCommand,
} from "@UiFolder/queries/CheckrollQuery";

import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/checkrollData.json";

import {
  InterOULooseFruitCollectionCreate,
  InterOULooseFruitCollectionEdit,
  InterOULooseFruitCollectionDelete,
} from "@UiFolder/pages/Checkroll/11_InterOULooseFruitCollection";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "CR_DATA";
const module = "Checkroll";
const submodule = "Crop";
const formName = "Inter-OU Loose Fruit Collection (Loan To)";
const keyName = "InterOULooseFruitCollection";
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2],
  [0, 3],
];

test.describe
  .serial("Inter-OU Loose Fruit Collection (Loan To) Tests", async () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    if (region === "IND") test.skip(true);

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

    docNo = DocNo[keyName];

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
  test("Create New Inter-OU Loose Fruit Collection (Loan To)", async ({
    page,
    db,
  }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals, gridVals } = await InterOULooseFruitCollectionCreate(
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

    docNo = await editJson(
      JsonPath,
      keyName,
      await page.locator("#txtLFCollectionNum").inputValue()
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0], ou[1]],
      [...columns, "OU", "LoanToOU"],
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
  test("Edit Inter-OU Loose Fruit Collection (Loan To)", async ({
    page,
    db,
  }) => {
    const { uiVals, gridVals } = await InterOULooseFruitCollectionEdit(
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
      docNo
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      checkrollGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou[0], ou[1]],
      [...columns, "OU", "LoanToOU"],
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
  test("Delete Inter-OU Loose Fruit Collection (Loan To)", async ({
    page,
    db,
  }) => {
    await InterOULooseFruitCollectionDelete(
      page,
      sideMenu,
      createValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(checkrollSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    if (dbValues.length > 0) throw new Error(`Deleting ${formName} failed`);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    console.log(`End Running: ${formName}`);
  });
});
