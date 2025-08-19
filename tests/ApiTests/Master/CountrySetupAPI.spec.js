import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe.serial("Country API", () => {
  let ctryKey;

  test("Add new Country", async ({ request, authToken }) => {
    const response = await request.post(
      "https://qa.quarto.cloud/zmasterapi/odata/Country",
      {
        data: {
          CtryCode: "TEST123",
          CtryDesc: "Country Create",
          Active: false,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );

    expect([200, 201]).toContain(response.status());

    const res = await response.json();
    console.log(await response.json());
    ctryKey = parseInt(res.CtryKey);
  });

  test("Get Country by CtryKey", async ({ request, authToken }) => {
    const response = await request.get(
      `https://qa.quarto.cloud/zmasterapi/odata/Country?key=${ctryKey}&$format=json`,
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
      "https://qa.quarto.cloud/zmasterapi/odata/Country?$orderby=CtryCode&$format=json&%24inlinecount=allpages&%24top=20&%24filter=Active%20eq%20true",
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
    const response = await request.put(
      `https://qa.quarto.cloud/zmasterapi/odata/Country(${ctryKey})`,
      {
        data: {
          "odata.metadata":
            "https://qalmonemasterapi-qa.azurewebsites.net/odata/$metadata#Country/@Element",
          ClientKey: 0,
          CtryKey: `${ctryKey}`,
          CtryCode: "TEST234",
          CtryDesc: "Country Edit",
          CtryCodeCtryDesc: "TEST234 - Country Edit",
          Active: true,
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
      }
    );

    if (response.status() === 204) {
      console.log("Update successful (no content returned)");
    } else {
      console.log(await response.json());
    }
    expect([200, 204]).toContain(response.status());
  });

  test("Delete Country Code", async ({ request, authToken }) => {
    const response = await request.delete(
      `https://qa.quarto.cloud/zmasterapi/odata/Country(${ctryKey})`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );

    if (response.status() === 204) {
      console.log("Delete successful (no content returned)");
    } else {
      console.log(await response.json());
    }
    expect([200, 204]).toContain(response.status());
  });
});
