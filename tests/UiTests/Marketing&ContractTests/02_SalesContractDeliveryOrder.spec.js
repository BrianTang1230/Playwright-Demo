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

import { marketingSQLCommand } from "@UiFolder/queries/MarketingQuery";

import {
  JsonPath,
  InputPath,
  DocNo,
} from "@utils/data/uidata/marketingData.json";

import {
  SalesContractDeliveryOrderCreate,
  SalesContractDeliveryOrderDelete,
  SalesContractDeliveryOrderEdit,
} from "@UiFolder/pages/Marketing&Contract/02_SalesContractDeliveryOrder";

import Login from "@utils/data/uidata/loginData.json";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "MAR&CON_DATA";
const module = "Marketing & Contract";
const submodule = null;
const formName = "Sales Contract Delivery Order";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Sales Contract Delivery Order Tests", async () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName
    );

    await checkLength(paths, columns, createValues, editValues);

    if (Login.Region === "IND") {
      docNo = DocNo[keyName + "IND"];
    } else {
      docNo = DocNo[keyName];
    }
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
  test("Create New Sales Contract Delivery Order", async ({ page, db }) => {
    const { uiVals } = await SalesContractDeliveryOrderCreate(
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
      await page.locator("#ContractDOSID").inputValue()
    );

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0]],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Sales Contract Delivery Order", async ({ page, db }) => {
    const { uiVals } = await SalesContractDeliveryOrderEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou
    );

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues(
      [...editValues, ou[0]],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Sales Contract Delivery Order", async ({ page, db }) => {
    await SalesContractDeliveryOrderDelete(page, sideMenu, editValues, ou);

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
      OU: ou[0],
    });

    if (dbValues.length > 0)
      throw new Error("Deleting Sales Contract Delivery Order failed");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    // if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    console.log(`End Running: ${formName}`);
  });
});
