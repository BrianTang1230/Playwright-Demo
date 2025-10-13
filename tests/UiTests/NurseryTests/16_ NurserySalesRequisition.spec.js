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
  nurseryGridSQLCommand,
  nurserySQLCommand,
} from "@UiFolder/queries/NurseryQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";
import {
  NurserySalesRequisitionCreate,
  NurserySalesRequisitionEdit,
  NurserySalesRequisitionDelete,
} from "@UiFolder/pages/Nursery/NurserySalesRequisition";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = null;
const formName = "Nursery Sales Requisition";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[1, 2, 3, 4]];

test.describe.serial("Nursery Sales Requisition Tests", async () => {
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
  test("Create New Nursery Sales Requisition", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals, gridVals } = await NurserySalesRequisitionCreate(
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
      formName,
      await page.locator("#txtSoldNum").inputValue()
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      nurseryGridSQLCommand(formName),
      {
        DocNo: docNo,
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
  test("Edit Nursery Sales Requisition", async ({ page, db }) => {
    const { uiVals, gridVals } = await NurserySalesRequisitionEdit(
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

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      nurseryGridSQLCommand(formName),
      {
        DocNo: docNo,
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
  test("Delete Nursery Sales Requisition", async ({ page, db }) => {
    await NurserySalesRequisitionDelete(page, sideMenu, editValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Nursery Sales Requisition failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    console.log(`End Running: ${formName}`);
  });
});
