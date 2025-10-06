import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import {
  AccountJsonPath,
  ACC_API_URL,
  ID,
  AccountPayloads,
} from "@utils/data/apidata/accountApiData.json";

let apiObj;
let transHdrKey;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "General Journal";
const basePayloads = AccountPayloads.GeneralJournal;

test.describe.serial("General Journal API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );
    apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test.describe("CRUD Operation Testing", () => {
    test("Add new General Journal transaction", async ({ api }) => {
      apiObj.setUrl(
        `${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`
      );

      const { key, status, json } = await apiObj.create(
        {
          ...basePayloads,
        },
        { key: "TransHdrKey" }
      );
      //   expect(status).toBe[(200, 201)]; // or [200, 201]

      transHdrKey = key;
    });
  });
});
