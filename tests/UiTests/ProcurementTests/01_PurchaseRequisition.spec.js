import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateDBValues,
  ValidateGridValues,
} from "@UiFolder/functions/ValidateValues";

import { procurementSQLCommand } from "@UiFolder/queries/ProcurementQuery";
import {
  JsonPath,
  InputPath,
  DocNo,
} from "@utils/data/uidata/procurementData.json";

import {
  PurchaseRequisitionCreate,
  PurchaseRequisitionEdit,
  PurchaseRequisitionDelete,
} from "@UiFolder/pages/Procurement/PurchaseRequisition";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "PROCUR_Data";
const module = "Procurement";
const submodule = null;
const formName = "Purchase Requisition";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Purchase Requisition Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName
    );

    await checkLength(paths, columns, createValues, editValues);

    // Clean up existing record if any
    docNo = DocNo[keyName];
    if (docNo) {
      await db.deleteData(deleteSQL, { DocNo: docNo });
    }

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
  test("Create Purchase Requisition", async ({ page, db }) => {
    await PurchaseRequisitionCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    // Save document number to json file
    docNo = await page.locator("#txtRequisitionNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    const uiVals = await getUiValues(page, paths.slice(0, 3));
    await page.locator("#btnEditItem").click();
    const gridVals = await getUiValues(page, paths.slice(3, paths.length));

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(createValues, columns, [...uiVals, ...gridVals]);
    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Purchase Requisition", async ({ page, db }) => {
    await PurchaseRequisitionEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    const uiVals = await getUiValues(page, paths.slice(0, 3));
    await page.locator("#btnEditItem").click();
    const gridVals = await getUiValues(page, paths.slice(3, paths.length));

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(editValues, columns,  [...uiVals, ...gridVals]);
    await ValidateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Purchase Requisition", async ({ page, db }) => {
    await PurchaseRequisitionDelete(page, sideMenu, editValues, ou, docNo);

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error(`Deleting ${formName} failed`);
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async () => {
    console.log(`End Running: ${formName}`);
  });
});
