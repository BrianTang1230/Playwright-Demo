import { test } from "@playwright/test";
import LoginPage from "@UiFolder/pages/General/LoginPage";
import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
import {
  InputPath,
  JsonPath,
  DocNo,
} from "@utils/data/uidata/nurseryData.json";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "@UiFolder/functions/ValidateValues";
import {
  PreNurseryGerminatedCreate,
  PreNurseryGerminatedEdit,
  PreNurseryGerminatedDelete,
} from "@UiFolder/pages/Nursery/PreNurseryGerminated";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import { nurserySQLCommand } from "@UiFolder/uiutils/NurseryQuery";
import { SelectRecord, FilterRecord } from "@UiFolder/functions/OpenRecord";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;
let db;
let ou;
let docNo;

// Excel info
const sheetName = "NUR_DATA";
const module = "Nursery";
const submodule = "Pre Nursery";
const formName = "Pre Nursery Germinated";
const paths = InputPath.PreNurseryGerminatedPath.split(",");
const columns = InputPath.PreNurseryGerminatedColumn.split(",");

test.describe("Pre Nursery Germinated", () => {
  test.beforeAll(async () => {
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();

    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");

    db = new DBHelper("MY");
    await db.connect();

    docNo = DocNo[formName.split(" ").join("")];
    if (docNo) {
      const deleteSQL = await connectExcel.readExcel("DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo });
    }
    ou = await connectExcel.readExcel("OperatingUnit");
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm(module, submodule, formName);

    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  test("Create Pre Nursery Germinated", async ({ page }) => {
    const allValues = await PreNurseryGerminatedCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    // Saved DocNo
    docNo = await page.locator("#txtPGNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    await ValidateUiValues(createValues, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateDBValues(
      [...createValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  test("Edit Pre Nursery Germinated", async ({ page }) => {
    const allValues = await PreNurseryGerminatedEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    await ValidateUiValues(editValues, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateDBValues(
      [...editValues, ou],
      [...columns, "OU"],
      dbValues[0]
    );
  });

  test("Delete Pre Nursery Germinated", async ({ page }) => {
    await PreNurseryGerminatedDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error(
        "DB validation failed when deleting Pre Nursery Germinated"
      );
    }
  });

  test.afterAll(async () => {
    // Close database connection
    await db.closeAll();
  });
});
