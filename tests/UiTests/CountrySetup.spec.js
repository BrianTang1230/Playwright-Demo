import { expect, test } from "@playwright/test";
import LoginPage from "../../UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  TOKEN,
  InputPath,
} from "../../UiTestsFolder/data/masterData.json";
import { ValidateUiValues } from "../../UiTestsFolder/functions/ValidateValues";
import {
  CountrySetupCreate,
  CountrySetupEdit,
  CountrySetupDelete,
} from "../../UiTestsFolder/pages/MasterFile/CountrySetupPage";
import ConnectExcel from "../../UiTestsFolder/pages/General/ConnectExcel";

// ---------------- Global Variables ----------------
let sideMenu;
let connectExcel;
let createValues;
let editValues;

// API URL
const url = API_URL + "/odata/Country";

// Excel info
const sheetName = "MAS_DATA";
const submodule = "General";
const formName = "Country Setup";
const paths = InputPath.CountrySetupPath.split(",");
const columns = InputPath.CountrySetupColumn.split(",");

test.describe("Country Setup Tests", () => {
  // ---------------- Before All ----------------
  test.beforeAll(async ({ request }) => {
    // Initialize Excel connection
    connectExcel = new ConnectExcel();
    await connectExcel.init();

    // Read Excel data once
    createValues = (
      await connectExcel.readExcel(sheetName, formName, "CreateData")
    ).split(";");
    editValues = (
      await connectExcel.readExcel(sheetName, formName, "EditData")
    ).split(";");

    // Function to delete a country code if it exists
    async function deleteIfExists(ctryCode) {
      const response = await request.get(
        `${url}?$filter=CtryCode+eq+%27${ctryCode}%27`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const dbData = await response.json();

      if (dbData.value.length > 0) {
        const deleteResp = await request.delete(
          `${url}(${dbData.value[0].CtryKey})`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );
        expect(deleteResp.ok()).toBeTruthy();
      }
    }

    // Delete any existing entries in parallel
    await Promise.all([
      deleteIfExists(createValues[0]),
      deleteIfExists(editValues[0]),
    ]);
  });

  // ---------------- Before Each ----------------
  test.beforeEach(async ({ page }) => {
    // Login and navigate to the form
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await loginPage.navigateToForm("Master File", submodule, formName);

    // Initialize side menu
    sideMenu = new SideMenuPage(page);
    await sideMenu.sideMenuBar.waitFor();
  });

  // ---------------- Tests ----------------
  test("Create New Country Code", async ({ page }) => {
    const allValues = await CountrySetupCreate(
      page,
      sideMenu,
      paths,
      columns,
      createValues
    );

    const isMatch = await ValidateUiValues(createValues, allValues);
    if (!isMatch)
      throw new Error("UI validation failed when creating new Country Code");
  });

  test("Edit Country Code", async ({ page }) => {
    const allValues = await CountrySetupEdit(
      page,
      sideMenu,
      paths,
      columns,
      createValues,
      editValues
    );

    const isMatch = await ValidateUiValues(editValues, allValues);
    if (!isMatch)
      throw new Error("UI validation failed when editing Country Code");
  });

  test("Delete Country Code", async ({ page, request }) => {
    await CountrySetupDelete(page, sideMenu, editValues);

    const response = await request.get(
      `${url}?$filter=CtryCode+eq+%27${editValues[0]}%27`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    expect(response.ok()).toBeTruthy();
    const dbData = await response.json();
    if (dbData.value.length > 0)
      throw new Error("Country Code was not deleted successfully");
  });
});
