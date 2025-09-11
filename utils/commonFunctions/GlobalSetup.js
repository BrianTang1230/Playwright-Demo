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
  api: async ({}, use) => {
    const authContext = await request.newContext();

    const response = await authContext.post("/zmasterapi/token", {
      form: {
        grant_type: "password",
        client_id: process.env.TEST_CLIENTID,
        username: process.env.TEST_USERNAME,
        medium_type: "web",
        password: process.env.TEST_PASSWORD,
      },
    });

    const body = await response.json();
    if (!body.access_token) throw new Error("❌ Failed to get token");
    await authContext.dispose();

    // Now create a context with token pre-injected
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${body.access_token}`,
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },
});
