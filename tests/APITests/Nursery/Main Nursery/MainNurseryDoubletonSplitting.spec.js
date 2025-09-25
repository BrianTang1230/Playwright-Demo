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
let mdbtSplitKey, mdbtSplitNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Doubleton Splitting";
const savedKey = ID.MainNurseryDoubletonSplitting.key;
const savedDocNo = ID.MainNurseryDoubletonSplitting.num;

test.describe.serial("Main Nursery Doubleton Splitting API Test", () => {
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

  test("Add new Main Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurDbtSplitPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        MDbtSplitKey: 37,
        ClientKey: 0,
        OUKey: 16,
        OUCode: "",
        OUDesc: "",
        OUCodeOUDesc: "",
        CompKey: 0,
        MDbtSplitNum: "",
        NurBatchKey: 138,
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "PA001 - PA BATCH 1",
        MDbtSplitDate: currentDate,
        SplitQty: createValues[0],
        AvlbQty: 0.0,
        MSeedling: 0.0,
        Remarks: createValues[1],
        Status: "O",
        StatusDesc: "OPEN",
        CreatedBy: 6,
        CreatedByCode: "LMSUPPORT",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-29T13:21:53.4537023",
        UpdatedBy: 6,
        UpdatedDate: "2025-08-29T05:21:53.4537023Z",
        UpdatedByCode: "LMSUPPORT",
        UpdatedByDesc: "lmsupport",
        RowState: 1,
      },
      { key: "MDbtSplitKey", num: "MDbtSplitNum" }
    );

    mdbtSplitKey = key;
    mdbtSplitNum = num;
  });

  test("Get Main Nursery Doubleton Splitting transaction by HdrKey", async ({
    api,
  }) => {
    const keyToUse = mdbtSplitKey || savedKey;

    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurDbtSplit?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Main Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurDbtSplit?$format=json&$orderby=MDbtSplitDate%20desc,MDbtSplitKey&$select=MDbtSplitKey,MDbtSplitNum,StatusDesc,OUCode,NurBatchCodeDesc,SplitQty,MDbtSplitDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(MDbtSplitDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20MDbtSplitDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Main Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const keyToUse = mdbtSplitKey || savedKey;
    const docNoToUse = mdbtSplitNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurDbtSplitPost`);
    const { status, json } = await apiObj.update("POST", {
      MDbtSplitKey: `${keyToUse}`,
      ClientKey: 0,
      OUKey: 16,
      OUCode: "",
      OUDesc: "",
      OUCodeOUDesc: "",
      CompKey: 1,
      MDbtSplitNum: `${docNoToUse}`,
      NurBatchKey: 138,
      NurBatchCode: "",
      NurBatchDesc: "",
      NurBatchCodeDesc: "PA001 - PA BATCH 1",
      MDbtSplitDate: currentDate,
      SplitQty: editValues[0],
      AvlbQty: 1000.0,
      MSeedling: 0.0,
      Remarks: editValues[1],
      Status: "O",
      StatusDesc: "OPEN",
      CreatedBy: 6,
      CreatedByCode: "LMSUPPORT",
      CreatedByDesc: "lmsupport",
      CreatedDate: "2025-08-29T13:21:53.453",
      UpdatedBy: 6,
      UpdatedDate: "2025-08-29T05:22:08.3631502Z",
      UpdatedByCode: "LMSUPPORT",
      UpdatedByDesc: "lmsupport",
      RowState: 2,
    });
  });

  test("Delete Main Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const keyToUse = mdbtSplitKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurDbtSplitPost?key=${keyToUse}`);
    await apiObj.delete();
  });
});
