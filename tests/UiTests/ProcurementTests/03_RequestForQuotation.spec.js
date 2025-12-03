import { test, region } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateDBValues,
  ValidateGridValues,
} from "@UiFolder/functions/ValidateValues";

import {
  procurementGridSQLCommand,
  procurementSQLCommand,
} from "@UiFolder/queries/ProcurementQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/procurementData.json";

import {
  RequestforQuotationCreate,
  RequestforQuotationEdit,
  RequestforQuotationDelete,
} from "@UiFolder/pages/Procurement/02_RequestForQuotation";

import { Region } from "@utils/data/uidata/loginData.json";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "PROCUR_Data";
const module = "Procurement";
const submodule = null;
const formName = "Request for Quotation";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[4, 5, 11, 12, 17, 18, 19]];

test.describe.serial("Request for Quotation Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    if (region === "MY") test.skip(true);

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

  // ---------------- Before Each ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Create Test ----------------
  test("Create Request for Quotation", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo });

    const { uiVals, gridVals } = await RequestforQuotationCreate(
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
      await page.locator("#txtQRFNum").inputValue()
    );

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });

    const gridDbValues = await db.retrieveGridData(
      procurementGridSQLCommand(formName),
      {
        DocNo: docNo,
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou],
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
  test("Edit Request for Quotation", async ({ page, db }) => {
    const { uiVals, gridVals } = await RequestforQuotationEdit(
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

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });

    const gridDbValues = await db.retrieveGridData(
      procurementGridSQLCommand(formName),
      {
        DocNo: docNo,
      }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou],
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
  test("Delete Request for Quotation", async ({ page, db }) => {
    await RequestforQuotationDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error(`Deleting ${formName} failed`);
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo });

    console.log(`End Running: ${formName}`);
  });
});
