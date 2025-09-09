import { test as base } from "@playwright/test";
import DBHelper from "@UiFolder/pages/General/DBHelper";
import ConnectExcel from "@utils/excel/ConnectExcel";

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
  excel: [
    async ({}, use) => {
      const excel = new ConnectExcel();
      await excel.init();
      await use(excel);
    },
    { scope: "worker" },
  ],
});

module.exports = { test };
