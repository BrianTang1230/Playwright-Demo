import { test, region } from "@utils/commonFunctions/GlobalSetup";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import editJson from "@utils/commonFunctions/EditJson";
import { checkLength, chunkArray } from "@UiFolder/functions/comFuncs";
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
  GeneralJournalCreate,
  GeneralJournalDelete,
  GeneralJournalEdit,
} from "@UiFolder/pages/Account/01_GeneralJournal";

// ---------------- Set Global Variables ----------------
let ou;
let docNo;
let sideMenu;
let createValues;
let editValues;
let deleteSQL;
let gridCreateValues;
let gridEditValues;
const sheetName = "ACC_Data";
const module = "Account";
const submodule = "General Ledger";
const formName = "General Journal";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");
const gridPaths = GridPath[keyName + "Grid"].split(",");
const cellsIndex = [
  [1, 2, 3, 4, 6, 7],
  [1, 2, 3, 4, 6, 7],
];
const cellsIndexIND = [
  [1, 2, 3, 4, 6, 7],
  [1, 2, 3, 4, 6, 7],
];

const dwCellIndex = region === "IND" ? cellsIndexIND : cellsIndex;
const dwCols = region === "IND" ? columns.slice(0, 4) : columns;
const dwPaths = region === "IND" ? paths.slice(0, 4) : paths;

test.describe.serial("General Journal Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll("Setup Excel, DB, and initial data", async ({ excel }) => {
    [
      createValues,
      editValues,
      deleteSQL,
      ou,
      gridCreateValues,
      gridEditValues,
    ] = await excel.loadExcelValues(sheetName, formName, { hasGrid: true });

    await checkLength(dwPaths, dwCols, createValues, editValues);

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
  test("Create General Journal", async ({ page, db }) => {
    // 1. Pre-test cleanup using SQL to avoid duplicate data errors
    if (docNo) {
        await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });
    }

    // 2. Execute UI Create Step
    const { uiVals, gridVals } = await GeneralJournalCreate(
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
      await page.locator("#txtDocNum").inputValue() 
    );

    // 4. Retrieve Database Values
    const dbValues = await db.retrieveData(accountSQLCommand(formName), {
      DocNo: docNo,
    });

    const gridDbValues = await db.retrieveGridData(
      accountGridSQLCommand(formName),
      { DocNo: docNo, OU: ou[0] }
    );
    const gridDbColumns = Object.keys(gridDbValues[0]);

    // 5. Validations
    await validateFormValues(createValues, dwCols, uiVals);
    await validateDBValues([...uiVals, ou[0]], [...dwCols, "OU"], dbValues[0]);
    await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);

    const rowData = chunkArray(gridVals, gridDbColumns.length);
    console.log("\n--- Starting Grid DB Validation ---");
    for (let i = 0; i < rowData.length; i++) {
      console.log(`\nValidating Row ${i + 1}...`);
      await validateDBValues(rowData[i], gridDbColumns, gridDbValues[i]);
    };
  });
});