import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import { allPhases } from "@utils/data/uidata/globalData.json";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import {
  checkLength,
  getUniversalDate,
  setCurrForm,
  setCurrPhase,
  throwTestFailMsg,
} from "@UiFolder/functions/comFuncs";
import {
  validateFormValues,
  validateDBValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  cmSQLCommand,
  cmGridSQLCommand,
} from "@UiFolder/queries/ContractorManagementQuery";
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
let gridCreateValues;
let gridEditValues;
let phaseCount = 0;
let createdByThisRun = false;
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
    console.log(getUniversalDate());
    await setCurrForm(formName);
    await setCurrPhase(allPhases[phaseCount]);

    // Load Excel values
    [
      createValues,
      editValues,
      deleteSQL,
      ou,
      gridCreateValues,
      gridEditValues,
    ] = await excel.loadExcelValues(sheetName, formName, {
      hasGrid: true,
    });

    await checkLength(
      paths,
      columns,
      [...createValues, ...gridCreateValues[0].split(";")],
      [...editValues, ...gridEditValues[0].split(";")],
    );

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
      gridCreateValues,
      ou,
    );

    // Save document number to json file
    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtJONum").inputValue(),
    );

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(cmGridSQLCommand(formName), {
      DocNo: docNo,
    });
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");

    await validateFormValues(
      createValues.map((values) => {
        value.replace(/\[TODAY\]/g, getUniversalDate());
        value.replace(/\[TODAY\+1]/g, getUniversalDate({ days: 1 }));
        value.replace(/\[TODAY\+5]/g, getUniversalDate({ days: 5 }));
      }),
      columns.slice(0, 13),
      uiVals,
    );
    await validateDBValues(
      [...uiVals, ou[0]],
      [...columns.slice(0, 13), "OU"],
      dbValues[0],
    );

    await validateFormValues(
      gridCreateValues.join(";").split(";"),
      columns.slice(13),
      gridVals,
    );
    await validateDBValues(gridVals, columns.slice(13), gridDbValues[0]);
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
      gridCreateValues,
      gridEditValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(cmGridSQLCommand(formName), {
      DocNo: docNo,
    });
    !gridDbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Grid record not found");

    await validateFormValues(createValues, columns.slice(0, 13), uiVals);
    await validateDBValues(
      [...uiVals, ou[0]],
      [...columns.slice(0, 13), "OU"],
      dbValues[0],
    );

    await validateFormValues(
      gridCreateValues.join(";").split(";"),
      columns.slice(13),
      gridVals,
    );
    await validateDBValues(gridVals, columns.slice(13), gridDbValues[0]);
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
      gridCreateValues,
      gridEditValues,
      ou,
      docNo,
    );

    const dbValues = await db.retrieveData(cmSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(cmGridSQLCommand(formName), {
      DocNo: docNo,
    });
    !gridDbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");

    await validateFormValues(
      editValues.map((values) => {
        value.replace(/\[TODAY\+2]/g, getUniversalDate({ days: 2 }));
        value.replace(/\[TODAY\+6]/g, getUniversalDate({ days: 6 }));
      }),
      columns.slice(0, 13),
      uiVals,
    );
    await validateDBValues(
      [...uiVals, ou[0]],
      [...columns.slice(0, 13), "OU"],
      dbValues[0],
    );

    await validateFormValues(
      gridEditValues.join(";").split(";"),
      columns.slice(13),
      gridVals,
    );
    await validateDBValues(gridVals, columns.slice(13), gridDbValues[0]);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
    console.log(`End Tests Running: ${formName}\n${"=".repeat(90)}`);
  });
});
