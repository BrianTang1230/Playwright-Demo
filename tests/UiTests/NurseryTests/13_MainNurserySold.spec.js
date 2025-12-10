import { test } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength } from "@UiFolder/functions/comFuncs";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";

import { nurserySQLCommand } from "@UiFolder/queries/NurseryQuery";
import {
  InputPath,
  JsonPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";

import {
  MainNurserySoldCreate,
  MainNurserySoldEdit,
  MainNurserySoldDelete,
} from "@UiFolder/pages/Nursery/13_MainNurserySold";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Main Nursery";
const formName = "Main Nursery Sold";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Main Nursery Sold Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName
    );

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
  test("Create Main Nursery Sold", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
    const { uiVals } = await MainNurserySoldCreate(
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
      await page.locator("#txtMSNum").inputValue()
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Edit Test ----------------
  test("Edit Main Nursery Sold", async ({ page, db }) => {
    const { uiVals } = await MainNurserySoldEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(editValues, columns, uiVals);
    await ValidateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Delete Test ----------------\
  test("Delete Main Nursery Sold", async ({ page, db }) => {
    await MainNurserySoldDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error("Deleting Main Nursery Sold failed.");
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    await editJson(JsonPath, formName, "");

    console.log(`End Running: ${formName}`);
  });
});
