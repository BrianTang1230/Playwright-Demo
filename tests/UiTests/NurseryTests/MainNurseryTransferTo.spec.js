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
  MainNurseryTransferToCreate,
  MainNurseryTransferToEdit,
  MainNurseryTransferToDelete,
} from "@UiFolder/pages/Nursery/MainNurseryTransferTo";
import ConnectExcel from "@utils/excel/ConnectExcel";
import DBHelper from "@UiFolder/uiutils/DBHelper";
import editJson from "@utils/commonFunctions/EditJson";
import { nurserySQLCommand } from "@UiFolder/uiutils/NurseryQuery";

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
const submodule = "Main Nursery";
const formName = "Inter-OU Main Nursery Transfer To";
const keyName = formName.split(" ").join("");
const paths = InputPath[keyName + "Path"].split(",");
const columns = InputPath[keyName + "Column"].split(",");

test.describe.serial("Inter-OU Main Nursery Transfer To Tests", () => {
  test.beforeAll(async () => {
    // Initialize Excel connection
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init();

    // Read Excel data once
    createValues = (await connectExcel.readExcel("CreateData")).split(";");
    editValues = (await connectExcel.readExcel("EditData")).split(";");

    // Initialize database connection
    db = new DBHelper();
    await db.connect();

    docNo = DocNo[keyName];
    if (docNo) {
      const deleteSQL = await connectExcel.readExcel("DeleteSQL");
      await db.deleteData(deleteSQL, { DocNo: docNo });
    }
    ou = (await connectExcel.readExcel("OperatingUnit")).split(";");
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm(module, submodule, formName);

    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  test("Create Inter-OU Main Nursery Transfer To", async ({ page }) => {
    const allValues = await MainNurseryTransferToCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      ou
    );

    docNo = await page.locator("#txtNTNum").inputValue();
    await editJson(JsonPath, formName, docNo);

    await ValidateUiValues(createValues, columns, allValues);

    console.log("DocNo:", docNo);
    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    console.log("DB Values:", dbValues);
    await ValidateDBValues(
      [...createValues, ou[0], ou[1]],
      [...columns, "FromOU", "ToOU"],
      dbValues[0]
    );
  });

  test("Edit Inter-OU Main Nursery Transfer To", async ({ page }) => {
    const allValues = await MainNurseryTransferToEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues,
      ou,
      docNo
    );

    await ValidateUiValues(editValues, columns, allValues);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    await ValidateDBValues(
      [...editValues, ou[0], ou[1]],
      [...columns, "FromOU", "ToOU"],
      dbValues[0]
    );
  });

  test("Delete Inter-OU Main Nursery Transfer To", async ({ page }) => {
    await MainNurseryTransferToDelete(page, sideMenu, createValues, ou, docNo);

    const dbValues = await db.retrieveData(nurserySQLCommand(formName), {
      DocNo: docNo,
    });

    if (dbValues.length > 0) {
      throw new Error("Deleting Inter-OU Main Nursery Transfer To failed");
    }
  });

  test.afterAll(async () => {
    // Close database connection
    await db.closeAll();
  });
});
