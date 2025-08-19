const { expect } = require("@playwright/test");
const { test } = require("../fixtures/fixtures");

test.describe.serial("Country API", () => {
  let ctryKey;

  test("Add new Country", async ({ request, authToken }) => {
    const response = await request.post(
      "https://qa.quarto.cloud/zmasterapi/odata/Country",
      {
        data: {
          CtryCode: "TEST123",
          CtryDesc: "Country Create",
          Active: true,
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
      "https://qa.quarto.cloud/zmasterapi/odata/Country",
      {
        data: {
          CtryCode: "TEST123",
          CtryDesc: "Country Create",
          Active: true,
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
});
