import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import { loadExcelData } from "@utils/commonFunctions/LoadExcel";
import {
  AccountJsonPath,
  FIN_API_URL,
  ID,
  Payloads,
} from "@utils/data/apidata/accountApiData.json";

let apiObj;
let glKey, glNum;
let createValues, editValues;

const currentDate = new Date().toISOString().split("T")[0];
const finUrl = FIN_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "General Journal";
const basePayload = Payloads.JournalVoucher;
const savedKey = ID.GL.key;
const savedDocNo = ID.GL.num;

test.describe.serial("General Journal API Test", () => {
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // force API mode
        apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);

        // 🔑 Load values directly from Excel
        createValues = (await excel.readExcel(sheetName, formName, "CreateAPIData", false))?.split(";") || [];
        editValues   = (await excel.readExcel(sheetName, formName, "EditAPIData", false))?.split(";") || [];
    });


  test.beforeEach(async ({ api }) => {
    apiObj.api = api; // rebind fresh api context
  });

  test.describe("CRUD Operation Testing", () => {
    test("Add new General Journal transaction", async ({ api }) => {
      apiObj.setUrl(`${finUrl}?form=%27GL%27&Environment=qaa&AttachmentID=""`);

      const { key, num, status } = await apiObj.create(
        {
            ...basePayload,
            GLDate: currentDate,
            GLDesc: createValues?.[0] || "Testing GL",
            Remarks: createValues?.[1] || "Initial entry",
            OUKey: createValues?.[2] || 1,
            CurrKey: createValues?.[3] || 1,
            DocAmt: createValues?.[4] || 100,
            RowState: 1,
            TransHdrKey: "501599",               // 0 or a valid key from SQL
            AttachmentID: "00000000-0000-0000-0000-000000000000" // placeholder GUID if required
        },
        {
          key: "TransHdrKey",
          num: "DocNum",
        }
      );

      expect([200, 201]).toContain(status);
      glKey = key;
      glNum = num;
    });

    test("Get General Journal by HdrKey", async () => {
      const keyToUse = glKey || savedKey;
      apiObj.setUrl(`${finUrl}/odata/GL?HdrKey=${keyToUse}&$format=json`);
      await apiObj.getByKey(false, {}, [200]);
    });

    test("Get all General Journal transactions", async () => {
      apiObj.setUrl(
        `${finUrl}/odata/GL?$format=json&$orderby=GLDate desc,TransHdrKey&$top=20`
      );
      await apiObj.getAll([200]);
    });

    test("Update General Journal transaction", async () => {
      const keyToUse = glKey || savedKey;
      const docNoToUse = glNum || savedDocNo;

      apiObj.setUrl(`${finUrl}/api/GL?form=GL&Environment=qaa`);

      const { status } = await apiObj.update("POST", {
        ...basePayload,
        TransHdrKey: keyToUse,
        DocNum: docNoToUse,
        GLDate: currentDate,
        GLDesc: editValues?.[0] || "Updated GL",
        Remarks: editValues?.[1] || "Updated entry",
        OUKey: editValues?.[2] || 1,
        CurrKey: editValues?.[3] || 1,
        DocAmt: editValues?.[4] || 200,
        RowState: 2,
      });

      expect([200, 201]).toContain(status);
    });

    test("Delete General Journal transaction", async () => {
      const keyToUse = glKey || savedKey;
      apiObj.setUrl(`${finUrl}/api/GL?key=${keyToUse}`);
      await apiObj.delete([200, 204]);
    });
  });
});