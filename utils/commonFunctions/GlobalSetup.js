import { test as base, request } from "@playwright/test";
import DBHelper from "@UiFolder/pages/General/DBHelper";
import ConnectExcel from "@utils/excel/ConnectExcel";
import { handleApiResponse } from "@ApiFolder/apiUtils/apiHelpers";
require("dotenv").config();

export const test = base.extend({
  db: [
    async ({}, use) => {
      const db = new DBHelper();
      await db.connect();
      await use(db);
      await db.closeAll();
    },
    { scope: "worker" },
  ],
  excel: [
    async ({}, use) => {
      const excel = new ConnectExcel();
      await excel.init();
      await use(excel);
    },
    { scope: "worker" },
  ],
  authToken: async ({}, use) => {
    const requestContext = await request.newContext();

    const response = await requestContext.post(
      "https://qa.quarto.cloud/zmasterapi/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        form: {
          grant_type: "password",
          client_id: process.env.TEST_CLIENTID,
          username: process.env.TEST_USERNAME,
          medium_type: "web",
          password: process.env.TEST_PASSWORD,
        },
      }
    );

    const body = await response.json().catch(() => {
      throw new Error("❌ Response is not valid JSON");
    });

    if (!body.access_token) {
      throw new Error(
        "❌ Failed to get token. Response: " + JSON.stringify(body, null, 2)
      );
    }

    await use(body.access_token);
    await requestContext.dispose();
  },
});