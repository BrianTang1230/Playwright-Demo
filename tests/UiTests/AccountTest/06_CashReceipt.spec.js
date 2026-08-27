import { test, region } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength, formatGridData } from "@UiFolder/functions/comFuncs";
import { FilterRecordByFiscalYearAndPeriod } from "@UiFolder/functions/OpenRecord";
import {
  validateFormValues,
  validateDBValues,
  validateGridValues,
} from "@UiFolder/functions/valuesFuncs";

import {
  accountSQLCommand,
  accountGridSQLCommand,
} from "@UiFolder/queries/AccountQuery";

import {
  InputPath,
  JsonPath,
  DocNo,
  GridPath,
} from "@utils/data/uidata/accountData.json";

import {
  CashReceiptCreate,
  CashReceiptEdit
} from "@UiFolder/pages/Account/06_CashReceipt";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
let filterData;
const sheetName = "ACC_Data";
const module = "Account";
const submodule = "Bank and Cash";
const formName = "Cash Receipt";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 3, 5, 6, 7],
  [1, 2, 3, 5, 6, 7],
];


const dwCellIndex = region === "IND" ? cellsIndex : cellsIndex;
const dwCols = region === "IND" ? columns : columns;
const dwPaths = region === "IND" ? paths : paths;

test.describe.serial("Cash Receipt Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    [
      createValues,
      editValues,
      deleteSQL,
      ou,
      gridCreateValues,
      gridEditValues,
      filterData
    ] = await excel.loadExcelValues(sheetName, formName, { hasGrid: true, hasFilter: true });

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
  test("Create Cash Receipt", async ({ page, db }) => {
    await db.deleteData(deleteSQL, { 
      DocNo: docNo, 
      OU: ou[0] 
    });

    const { uiVals, gridVals } = await CashReceiptCreate(
      page,
      sideMenu,
      dwPaths,
      dwCols,
      createValues,
      gridPaths,
      gridCreateValues,
      dwCellIndex,
      ou
    );

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("//input[@ng-model='headerData.DocNum']").first().inputValue() 
    );

    const dbValues = await db.retrieveData(accountSQLCommand(formName), {
      DocNo: docNo,
    });

    const gridDbValues = await db.retrieveGridData(
      accountGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(createValues, dwCols, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);
    
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);

    const rowData = formatGridData(gridVals, gridDbColumns.length);
    for (let i = 0; i < rowData.length; i++) {
      await validateDBValues(rowData[i], gridDbColumns, gridDbValues[i]);
    };
  });

// ---------------- Edit Test ----------------
  test('Edit Cash Receipt', async ({ page, db }) => {
    const fiscalYear = filterData[0];
    const period = filterData[1];

    const { uiVals, gridVals } = await CashReceiptEdit(
      page,
      sideMenu,
      dwPaths,
      dwCols,
      editValues,
      gridPaths,
      gridEditValues,
      dwCellIndex,
      ou,
      docNo,
      fiscalYear,
      period
    );

    docNo = await editJson(
      JsonPath,
      formName,
      await page.locator("//input[@ng-model='headerData.DocNum']").first().inputValue() 
    );

    const dbValues = await db.retrieveData(accountSQLCommand(formName), {
      DocNo: docNo
    });

    const gridDbValues = await db.retrieveGridData(
      accountGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] }
    );

    const gridDbColumns = Object.keys(gridDbValues[0]);

    await validateFormValues(editValues, dwCols, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);
    
    await validateGridValues(gridEditValues.join(";").split(";"), gridVals);

    const rowData = formatGridData(gridVals, gridDbColumns.length);
    for (let i = 0; i < rowData.length; i++) {
      await validateDBValues(rowData[i], gridDbColumns, gridDbValues[i]);
    };
  });

  // ---------------- Delete Test ----------------
  test('Delete Cash Receipt', async ({ db }) => {
    await db.deleteData(deleteSQL, { 
      DocNo: docNo, 
      OU: ou[0] 
    });

    const dbValues = await db.retrieveData(accountSQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues && dbValues.length > 0) {
      throw new Error(`Deletion failed! Record ${docNo} is still present in the database.`);
    } else {
      console.log(`\n Success! Record ${docNo} is completely gone from the database.`);
    }
  });
});