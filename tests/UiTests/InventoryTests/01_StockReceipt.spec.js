import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateGridValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import {
  inventoryGridSQLCommand,
  inventorySQLCommand,
} from "@UiFolder/queries/InventoryQuery";
import {
  JsonPath,
  InputPath,
  GridPath,
  DocNo,
} from "@utils/data/uidata/inventoryData.json";

import {
  StockReceiptCreate,
  StockReceiptDelete,
  StockReceiptEdit,
} from "@UiFolder/pages/Inventory/01_StockReceipt";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "INV_DATA";
const module = "Inventory";
const submodule = null;
const formName = "Stock Receipt";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");

test.describe.serial("Stock Receipt Tests", async () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName
    );

    await checkLength(paths, columns, createValues, editValues);

    docNo = DocNo[keyName];
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

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
  test("Create New Stock Receipt", async ({ page, db }) => {
    const { uiVals, gridVals } = await StockReceiptCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtReceiptNum").inputValue()
    );

    const dbValues = await db.retrieveData(inventorySQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      inventoryGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    await ValidateUiValues(
      createValues.slice(0, 6),
      columns.slice(0, 6),
      uiVals
    );

    await ValidateUiValues(
      createValues.slice(6, -1),
      columns.slice(6, -1),
      gridVals
    );
    await ValidateDBValues(
      [...createValues.slice(0, 6), ou[0]],
      [...columns.slice(0, 6), "OU"],
      dbValues[0]
    );
    await ValidateDBValues(
      createValues.slice(6, -1),
      columns.slice(6, -1),
      gridDbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Stock Receipt", async ({ page, db }) => {
    const { uiVals, gridVals } = await StockReceiptEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(inventorySQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    const gridDbValues = await db.retrieveGridData(
      inventoryGridSQLCommand(formName),
      {
        DocNo: docNo,
        OU: ou[0],
      }
    );

    await ValidateUiValues(editValues.slice(0, 6), columns.slice(0, 6), uiVals);

    await ValidateUiValues(
      editValues.slice(6, -1),
      columns.slice(6, -1),
      gridVals
    );
    await ValidateDBValues(
      [...editValues.slice(0, 6), ou[0]],
      [...columns.slice(0, 6), "OU"],
      dbValues[0]
    );
    await ValidateDBValues(
      editValues.slice(6, -1),
      columns.slice(6, -1),
      gridDbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Stock Receipt", async ({ page, db }) => {
    await StockReceiptDelete(page, sideMenu, editValues, ou, docNo);

    const dbValues = await db.retrieveData(inventorySQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    if (dbValues.length > 0) throw new Error("Deleting Stock Receipt failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    console.log(`End Running: ${formName}`);
  });
});
