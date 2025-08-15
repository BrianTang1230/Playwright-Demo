import { expect, test } from "@playwright/test";
import LoginPage from "../../UiTestsFolder/pages/General/LoginPage";
import SideMenuPage from "../../UiTestsFolder/pages/General/SideMenuPage";
import {
  API_URL,
  TOKEN,
  InputPath,
  CreateData,
  EditData,
} from "../../UiTestsFolder/data/masterData.json";
import {
  ValidateUiValues,
  ValidateDBValues,
} from "../../UiTestsFolder/functions/ValidateValues";
import {
  CountrySetupCreate,
  CountrySetupEdit,
  CountrySetupDelete,
} from "../../UiTestsFolder/pages/MasterFile/CountrySetupPage";

// Global variable for SideMenuPage
let sideMenu;

// Set token and API url
const url = API_URL + "/Country";

// Default elements and values for creation
const paths = InputPath.CountrySetupPath.split(",");
const columns = InputPath.CountrySetupColumn.split(",");
const createValues = CreateData.CountrySetupData.split(",");
const editValues = EditData.CountrySetupData.split(",");

test.beforeEach(async ({ page, request }) => {
  // Login and Navigate to the testing form
  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.navigateToForm("Master File", "General", "Country Setup");

  // Initialize sideMenu
  sideMenu = new SideMenuPage(page);
  await sideMenu.sideMenuBar.waitFor();

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

    expect(response.ok()).toBeTruthy(); // Check if the response is OK

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

      expect(deleteResp.ok()).toBeTruthy(); // Check if the delete response is OK
    }
  }
  await deleteIfExists(createValues[0]);
  await deleteIfExists(editValues[0]);
});

test("Create New Country Code", async ({ page, request }) => {
  const uiValues = await CountrySetupCreate(
    page,
    sideMenu,
    paths,
    columns,
    createValues
  );

  await ValidateUiValues(createValues, uiValues).then((isMatch) => {
    if (!isMatch) {
      throw new Error("UI validation failed");
    }
  });

  const response = await request.get(
    `${url}?$filter=CtryCode+eq+%27${createValues[0]}%27`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  expect(response.ok()).toBeTruthy(); // Check if the response is OK
  const dbData = await response.json();

  await ValidateDBValues(dbData.value[0], columns, createValues).then(
    (isMatch) => {
      if (!isMatch) {
        throw new Error("DB validation failed");
      }
    }
  );
});

test("Edit Country Code", async ({ page, request }) => {
  const uiValues = await CountrySetupEdit(
    page,
    sideMenu,
    paths,
    columns,
    createValues,
    editValues
  );

  await ValidateUiValues(editValues, uiValues).then((isMatch) => {
    if (!isMatch) {
      throw new Error("UI validation failed");
    }
  });

  const response = await request.get(
    `${url}?$filter=CtryCode+eq+%27${editValues[0]}%27`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  expect(response.ok()).toBeTruthy(); // Check if the response is OK
  const dbData = await response.json();

  await ValidateDBValues(dbData.value[0], columns, editValues).then(
    (isMatch) => {
      if (!isMatch) {
        throw new Error("DB validation failed");
      }
    }
  );
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

  expect(response.ok()).toBeTruthy(); // Check if the response is OK
  const dbData = await response.json();

  if (dbData.value.length > 0) {
    throw new Error("Record was not deleted successfully");
  }
});
