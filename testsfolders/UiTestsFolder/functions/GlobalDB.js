import { test as base } from "@playwright/test";
import DBHelper from "@UiFolder/pages/General/DBHelper";

const test = base.extend({
  db: [
    async ({}, use) => {
      const db = new DBHelper();
      await db.connect();
      await use(db);
      await db.closeAll();
    },
    { scope: "worker" },
  ],
});

module.exports = { test };
