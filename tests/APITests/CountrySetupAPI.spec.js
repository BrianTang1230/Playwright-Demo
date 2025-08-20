import { expect } from "@playwright/test";
import { test } from "../../testsfolders/apiUtils/Fixtures";
import ConnectExcel from "../../Utils/excel/ConnectExcel";
import { MAS_API_URL } from "../../testsfolders/ApiTestsFolder/ApiUrl.json";

test.describe.serial("Country API", () => {
  let ctryKey;
  let connectExcel;
  let createValues;
  let editValues;

  const url = MAS_API_URL;
  const sheetName = "MASAPI_Data";
  const formName = "Country Setup";

  test.beforeAll(async () => {
    // Initialize Excel connection
    connectExcel = new ConnectExcel();
    await connectExcel.init(false);

    // Read Excel data once
    createValues = (
      await connectExcel.readExcel(sheetName, formName, "CreateAPIData", false)
    ).split(";");
    editValues = (
      await connectExcel.readExcel(sheetName, formName, "EditAPIData", false)
    ).split(";");
  });

  test("Add new Country", async ({ request, authToken }) => {
    const response = await request.post(`${url}/odata/Country`, {
      data: {
        CtryCode: createValues[0],
        CtryDesc: createValues[1],
        Active: createValues[2] === "true",
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    expect([200, 201]).toContain(response.status());

    const res = await response.json();
    console.log(await response.json());
    ctryKey = parseInt(res.CtryKey);
  });

  test("Get Country by CtryKey", async ({ request, authToken }) => {
    const response = await request.get(
      `${url}/odata/Country?key=${ctryKey}&$format=json`,
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
    const response = await request.put(`${url}/odata/Country(${ctryKey})`, {
      data: {
        "odata.metadata":
          "https://qalmonemasterapi-qa.azurewebsites.net/odata/$metadata#Country/@Element",
        ClientKey: 0,
        CtryKey: `${ctryKey}`,
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
    const response = await request.delete(`${url}/odata/Country(${ctryKey})`, {
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
});
