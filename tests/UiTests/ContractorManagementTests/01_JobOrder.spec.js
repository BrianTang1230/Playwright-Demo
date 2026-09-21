import { test } from "@utils/commonFunctions/GlobalSetup";
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
  validateDBValues,
} from "@UiFolder/functions/valuesFuncs";

import { cmSQLCommand } from "@UiFolder/queries/ContractorManagementQuery";
import {
  JsonPath,
  InputPath,
  DocNo,
} from "@utils/data/uidata/contractorManagementData.json";

import {
  JobOrderCreate,
  JobOrderEdit1,
  JobOrderEdit2,
  JobOrderDelete,
} from "@UiFolder/pages/ContractorManagement/01_JobOrder";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let phaseCount = 0;
const sheetName = "CM_Data";
const module = "Contractor Management";
const submodule = null;
const formName = "Job Order";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.skip(`${formName} Tests`, () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    await setCurrForm(formName);
    await setCurrPhase(allPhases[phaseCount]);

    // Load Excel values
    [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
      sheetName,
      formName,
    );

    await checkLength(paths, columns, createValues, editValues);

    docNo = DocNo[keyName];

    console.log(`${"=".repeat(90)}\nStart Running: ${formName}`);
  });

  // ---------------- Before Each ----------------
  test.beforeEach("Login and Navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(module, submodule, formName);
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();

    phaseCount++;
    await setCurrPhase(allPhases[phaseCount]);
  });

  // ---------------- Create Test ----------------
  test(`Create ${formName}`, async ({ page, db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals, gridVals } = await JobOrderCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou,
    );

    // Save document number to json file
    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtRequisitionNum").inputValue(),
    );

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");

    await validateFormValues(createValues, columns, [...uiVals, ...gridVals]);
    await validateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0],
    );
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await JobOrderEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");

    await validateFormValues(createValues, columns, [...uiVals, ...gridVals]);
    await validateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0],
    );
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await JobOrderEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");

    await validateFormValues(editValues, columns, [...uiVals, ...gridVals]);
    await validateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0],
    );
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await JobOrderDelete(page, sideMenu, editValues, ou, docNo);

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });

    dbValues
      ? throwTestFailMsg("D-DB-RF", formName)
      : await editJson(JsonPath, formName, "");
  });

  // ---------------- After All ----------------
  test.afterAll(async ({}) => {
    console.log(`End Tests Running: ${formName}\n${"=".repeat(90)}`);
  });
});
