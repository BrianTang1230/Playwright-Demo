import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import NurseryApi from "@ApiFolder/pages/Nursery/NurseryPages.js";
import {
  NurseryJsonPath,
  NUR_API_URL,
  ID,
} from "@utils/data/apidata/nurseryApiData.json";

let apiObj;
let pCullKey, pCullNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Culling";
const savedKey = ID.PreNurseryCulling.key;
const savedDocNo = ID.PreNurseryCulling.num;

test.describe.serial("Pre Nursery Culling API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );

    apiObj = new NurseryApi(null, "", formName, NurseryJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test("Add new Pre Nursery Culling transaction", async ({ api }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurPCullPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        PCullKey: 146,
        ClientKey: 0,
        OUKey: 16,
        OUCode: "",
        OUDesc: "",
        OUCodeOUDesc: "",
        CompKey: 0,
        PCullNum: "",
        NurBatchKey: 138,
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "PA001 - PA BATCH 1",
        PCReasonKey: -1,
        PCReasonCode: "",
        PCReasonDesc: "",
        PCReasonCodeDesc: "",
        CullDate: currentDate,
        PCullDate: "0001-01-01T00:00:00",
        PCullQty: createValues[0],
        PCullSTQty: createValues[1],
        PCullDTQty: createValues[2],
        Remarks: createValues[3],
        Status: "O",
        StatusDesc: "OPEN",
        Stage: "After Germinated",
        CreatedBy: 6,
        CreatedByCode: "LMSUPPORT",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-22T15:21:45.2224647",
        UpdatedBy: 6,
        UpdatedDate: "2025-08-22T07:21:45.2224647Z",
        UpdatedByCode: "LMSUPPORT",
        UpdatedByDesc: "lmsupport",
        RowState: 1,
      },
      { key: "PCullKey", num: "PCullNum" }
    );

    pCullKey = key;
    pCullNum = num;
  });

  test("Get Pre Nursery Culling transaction by HdrKey", async ({ api }) => {
    const keyToUse = pCullKey || savedKey;

    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPCull?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Pre Nursery Culling transaction", async ({ api }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPCull?$format=json&$orderby=PCullDate%20desc,PCullKey&$select=PCullKey,PCullNum,StatusDesc,OUCode,NurBatchCodeDesc,PCullQty,PCullSTQty,PCullDTQty,PCullDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(PCullDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20PCullDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Pre Nursery Culling transaction", async ({ api }) => {
    const keyToUse = pCullKey || savedKey;
    const docNoToUse = pCullNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurPCullPost`);
    const { status, json } = await apiObj.update("POST", {
      PCullKey: `${keyToUse}`,
      ClientKey: 0,
      OUKey: 16,
      OUCode: "",
      OUDesc: "",
      OUCodeOUDesc: "",
      CompKey: 0,
      PCullNum: `${docNoToUse}`,
      NurBatchKey: 138,
      NurBatchCode: "",
      NurBatchDesc: "",
      NurBatchCodeDesc: "PA001 - PA BATCH 1",
      PCReasonKey: -1,
      PCReasonCode: "",
      PCReasonDesc: "",
      PCReasonCodeDesc: "",
      CullDate: currentDate,
      PCullDate: "0001-01-01T00:00:00",
      PCullQty: editValues[0],
      PCullSTQty: editValues[1],
      PCullDTQty: editValues[2],
      Remarks: editValues[3],
      Status: "O",
      StatusDesc: "OPEN",
      Stage: "After Germinated",
      CreatedBy: 6,
      CreatedByCode: "LMSUPPORT",
      CreatedByDesc: "lmsupport",
      CreatedDate: "2025-08-22T15:21:45.2224647",
      UpdatedBy: 6,
      UpdatedDate: "2025-08-22T07:21:45.2224647Z",
      UpdatedByCode: "LMSUPPORT",
      UpdatedByDesc: "lmsupport",
      RowState: 2,
    });
  });

  test("Delete Pre Nursery Culling transaction", async ({ api }) => {
    const keyToUse = pCullKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurPCullPost?key=${keyToUse}`);
    await apiObj.delete();
  });
});
