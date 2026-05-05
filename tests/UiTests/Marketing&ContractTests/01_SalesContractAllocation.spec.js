import { region, test } from "@utils/commonFunctions/GlobalSetup";
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
  validateGridValues,
  validateDBValues,
} from "@UiFolder/functions/valuesFuncs";

import { marketingSQLCommand } from "@UiFolder/queries/MarketingQuery";

import {
  JsonPath,
  InputPath,
  DocNo,
} from "@utils/data/uidata/marketingData.json";

import {
  SalesContractAllocationCreate,
  SalesContractAllocationEdit1,
  SalesContractAllocationEdit2,
  SalesContractAllocationDelete,
} from "@UiFolder/pages/Marketing&Contract/01_SalesContractAllocation";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let phaseCount = 0;
const sheetName = "MAR&CON_DATA";
const module = "Marketing & Contract";
const submodule = null;
const formName = "Sales Contract Allocation";
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

  // ---------------- Before Each  ----------------
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
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

    const { uiVals } = await SalesContractAllocationCreate(
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
      await page.locator("#ContractSID").inputValue(),
    );

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");
    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Edit Test (Without Saving) ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals } = await SalesContractAllocationEdit1(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
    );

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Edit Test (With Saving) ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals } = await SalesContractAllocationEdit2(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
    );

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...columns, "OU"], dbValues[0]);
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await SalesContractAllocationDelete(page, sideMenu, editValues, ou);

    const dbValues = await db.retrieveData(marketingSQLCommand(formName), {
      DocNo: docNo,
    });
    dbValues && throwTestFailMsg("D-DB-F", formName);
  });

  // ---------------- After All ----------------
  test.afterAll(async ({ db }) => {
    await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
    await editJson(JsonPath, formName, "");
    console.log(`End Running: ${formName}`);
  });
});
