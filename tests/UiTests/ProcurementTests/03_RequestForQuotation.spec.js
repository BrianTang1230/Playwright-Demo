import { test, region } from "@utils/commonFunctions/GlobalSetup";
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
  validateGridValues,
} from "@UiFolder/functions/valuesFuncs";

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
  RequestforQuotationEdit1,
  RequestforQuotationEdit2,
  RequestforQuotationDelete,
} from "@UiFolder/pages/Procurement/03_RequestForQuotation";

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
const sheetName = "PROCUR_Data";
const module = "Procurement";
const submodule = null;
const formName = "Request for Quotation";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [[4, 5, 11, 12, 17, 18, 19]];

test.describe.serial(`${formName} Tests`, () => {
  region === "MY" && test.skip(true);
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
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
    ] = await excel.loadExcelValues(sheetName, formName, { hasGrid: true });

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

    const { uiVals, gridVals } = await RequestforQuotationCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      gridPaths,
      gridCreateValues,
      cellsIndex,
      ou,
    );

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("#txtQRFNum").inputValue(),
    );

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues && throwTestFailMsg("C-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      procurementGridSQLCommand(formName),
      {
        DocNo: docNo,
      },
    );
    !gridDbValues &&
      throwTestFailMsg("C-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0],
    );
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(
      gridCreateValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0],
    );
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} Without Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await RequestforQuotationEdit1(
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
      docNo,
    );

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      procurementGridSQLCommand(formName),
      {
        DocNo: docNo,
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E1-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, columns, uiVals);
    await validateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0],
    );
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
    await validateDBValues(
      gridCreateValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0],
    );
  });

  // ---------------- Edit Test ----------------
  test(`Edit ${formName} With Saving`, async ({ page, db }) => {
    const { uiVals, gridVals } = await RequestforQuotationEdit2(
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
      docNo,
    );

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
      DocNo: docNo,
    });
    !dbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Form record not found");

    const gridDbValues = await db.retrieveGridData(
      procurementGridSQLCommand(formName),
      {
        DocNo: docNo,
      },
    );
    !gridDbValues &&
      throwTestFailMsg("E2-DB-NF", formName, "Grid record not found");
    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, columns, uiVals);
    await validateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0],
    );
    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
    await validateDBValues(
      gridEditValues.join(";").split(";"),
      gridDbColumns,
      gridDbValues[0],
    );
  });

  // ---------------- Delete Test ----------------
  test(`Delete ${formName}`, async ({ page, db }) => {
    await RequestforQuotationDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
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
