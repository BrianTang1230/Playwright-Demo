import { test } from "@utils/commonFunctions/GlobalSetup";
import { allPhases } from "@utils/data/uidata/globalData.json";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import {
  setCurrForm,
  setCurrPhase,
  checkLength,
  throwTestFailMsg,
} from "@UiFolder/functions/comFuncs";
import {
  validateFormValues,
  validateDBValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  InputPath,
  JsonPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";
import { nurserySQLCommand } from "@UiFolder/queries/NurseryQuery";

import {
  MainNurseryCullingCreate,
  MainNurseryCullingEdit1,
  MainNurseryCullingEdit2,
  MainNurseryCullingDelete,
} from "@UiFolder/pages/Nursery/10_MainNurseryCulling";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let phaseCount = 0;
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Main Nursery";
const formName = "Main Nursery Culling";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial(`${formName} Tests`, () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
    // Change Current Form and Phase
    await setCurrForm(formName);
    await setCurrPhase(allPhases[phaseCount]);

    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName,
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

    // Update Phase
    phaseCount++;
    await setCurrPhase(allPhases[phaseCount]);
  });

  // ---------------- Create Test ----------------
  test(`Create ${formName}`, async ({ page, db }) => {
    const { uiVals } = await MainNurseryCullingCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou,
    );

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtNCNum").inputValue(),
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Edit Test (Without Saving) ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals } = await MainNurseryCullingEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("E1-DB-NF", formName);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Edit Test (With Saving) ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals } = await MainNurseryCullingEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("E2-DB-NF", formName);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues([...uiVals, ou], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await MainNurseryCullingDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });
    dbValues && throwTestFailMsg("D-DB-RF", formName);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
    await editJson(JsonPath, formName, "");
    console.log(`End Running: ${formName}`);
  });
});
