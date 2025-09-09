import { expect } from "@playwright/test";
import { test } from "@ApiFolder/apiUtils/Fixtures.js";
import ConnectExcel from "@utils/excel/ConnectExcel";
import {
  JsonPath,
  MAS_API_URL,
  ID,
} from "@utils/data/apidata/masterApiData.json";
import {
  handleApiResponse,
  setGlobal,
} from "@ApiFolder/apiUtils/apiHelpers.js";
import editJson from "@utils/commonFunctions/EditJson";

let ctryKey;
let createValues;
let editValues;

const url = MAS_API_URL;
const sheetName = "MASAPI_Data";
const formName = "Country Setup";
const savedKey = ID.CountrySetup.key;

test.beforeAll(async () => {
  // Initialize Excel connection
  connectExcel = new ConnectExcel(sheetName, formName);
  await connectExcel.init(false);

  // Read Excel data once
  createValues = (
    await excel.readExcel(sheetName, formName, "CreateAPIData", false)
  ).split(";");
  editValues = (
    await excel.readExcel(sheetName, formName, "EditAPIData", false)
  ).split(";");
});

test("Add new Country", async ({ request, authToken }) => {
  const response = await request.post(`${url}/odata/Country`, {
    data: {
      "odata.metadata":
        "https://qalmonemasterapi-qad.azurewebsites.net/odata/$metadata#Country/@Element",
      ClientKey: 0,
      CtryKey: 1387,
      CtryCode: createValues[0],
      CtryDesc: createValues[1],
      CtryCodeCtryDesc: "123123 - 123123",
      Active: createValues[2] === "true",
      RcdType: 0,
      RcdTypeDesc: "User",
      CreatedBy: 6,
      CreatedByCode: "LMSUPPORT",
      CreatedDate: "0001-01-01T00:00:00",
      UpdatedBy: 6,
      UpdatedByCode: "LMSUPPORT",
      UpdatedDate: "0001-01-01T00:00:00",
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });

  const { status, json } = await handleApiResponse(response);

  expect([200, 201]).toContain(status);

  if (json) {
    // Call your dynamic setter
    const { key } = await setGlobal("master", json, {
      key: "CtryKey",
    });

    // Now you can use key & num directly too
    ctryKey = key;

    editJson(JsonPath, formName, { key: ctryKey }, false);
  }
});

test("Get Country by CtryKey", async ({ request, authToken }) => {
  const response = await request.get(
    `${url}/odata/Country?key=${savedKey}$format=json`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    }
  );
  console.log(await response.json());
  expect(response.status()).toBe(200);
});

test("Get all Country", async ({ request, authToken }) => {
  const response = await request.get(
    `${url}/odata/Country?$orderby=CtryCode&$format=json&%24inlinecount=allpages&%24top=20&%24filter=Active%20eq%20true`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    }
  );
  console.log(await response.json());
  expect(response.status()).toBe(200);
});

test("Update Country Code", async ({ request, authToken }) => {
  const response = await request.put(`${url}/odata/Country(${savedKey})`, {
    data: {
      "odata.metadata":
        "https://qalmonemasterapi-qa.azurewebsites.net/odata/$metadata#Country/@Element",
      ClientKey: 0,
      CtryKey: `${savedKey}`,
      CtryCode: editValues[0],
      CtryDesc: editValues[1],
      CtryCodeCtryDesc: "TEST234 - Country Edit",
      Active: editValues[2] === "true",
      RcdType: 0,
      RcdTypeDesc: "User",
      CreatedBy: 6,
      CreatedByCode: "LMSUPPORT",
      CreatedDate: "0001-01-01T00:00:00",
      UpdatedBy: 6,
      UpdatedByCode: "LMSUPPORT",
      UpdatedDate: "0001-01-01T00:00:00",
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  console.log(
    response.status() === 204
      ? "Update successful (no content returned)"
      : await response.json()
  );

  expect([200, 204]).toContain(response.status());
});

test("Delete Country Code", async ({ request, authToken }) => {
  const response = await request.delete(`${url}/odata/Country(${savedKey})`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });

  console.log(
    response.status() === 204
      ? "Delete successful (no content returned)"
      : await response.json()
  );

  expect([200, 204]).toContain(response.status());
});
