import { test } from "@playwright/test";
import DBHelper from "../../testsfolders/UiTestsFolder/uiutils/DBHelper";

let db;

test.describe("SQL Test Suite", () => {
  test.beforeEach(async ({}) => {
    db = new DBHelper("MY");
    await db.connect();
  });

  test("Master SQL Command", async ({}) => {
    const result = await db.retrieveData("Country Setup", { Code: "AF" });
    console.log(result);
  });

  test("Master Grid SQL Command", async ({}) => {
    const result = await db.retrieveGridData("Additional Remuneration Setup", {
      Code: "ADDREM123",
    });
    console.log(result);
  });
});
