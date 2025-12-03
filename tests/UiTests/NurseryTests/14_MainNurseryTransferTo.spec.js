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
  MainNurseryTransferToCreate,
  MainNurseryTransferToEdit,
  MainNurseryTransferToDelete,
} from "@UiFolder/pages/Nursery/14_MainNurseryTransferTo";

// ---------------- Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Main Nursery";
const formName = "Inter-OU Main Nursery Transfer To";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Inter-OU Main Nursery Transfer To Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
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
  test("Create Inter-OU Main Nursery Transfer To", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo });

    const { uiVals } = await MainNurseryTransferToCreate(
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
      await page.locator("#txtNTNum").inputValue()
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateUiValues(createValues, columns, uiVals);
    await ValidateDBValues(
      [...createValues, ou[0], ou[1]],
      [...columns, "FromOU", "ToOU"],
      dbValues[0]
    );
  });

  // ---------------- Edit Test ----------------
  test("Edit Inter-OU Main Nursery Transfer To", async ({ page, db }) => {
    const { uiVals } = await MainNurseryTransferToEdit(
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
    await ValidateDBValues(
      [...editValues, ou[0], ou[1]],
      [...columns, "FromOU", "ToOU"],
      dbValues[0]
    );
  });

  // ---------------- Delete Test ----------------
  test("Delete Inter-OU Main Nursery Transfer To", async ({ page, db }) => {
    await MainNurseryTransferToDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error("Deleting Inter-OU Main Nursery Transfer To failed");
    }
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    if (docNo) await db.deleteData(deleteSQL, { DocNo: docNo });

    await editJson(JsonPath, formName, "");
    
    console.log(`End Running: ${formName}`);
  });
});
