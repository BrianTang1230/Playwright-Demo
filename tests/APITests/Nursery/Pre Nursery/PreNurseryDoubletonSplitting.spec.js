import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import {
  NurseryJsonPath,
  NUR_API_URL,
  ID,
  NurseryPayloads,
} from "@utils/data/apidata/nurseryApiData.json";

let apiObj;
let pdbtSplitKey, pdbtSplitNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Doubleton Splitting";
const basePayloads = NurseryPayloads.PreNurseryDoubletonSplitting;
const savedKey = ID.PreNurseryDoubletonSplitting.key;
const savedDocNo = ID.PreNurseryDoubletonSplitting.num;

test.describe.serial("Pre Nursery Doubleton Splitting API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode /
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );
    apiObj = new ApiCallBase(null, "", formName, NurseryJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test("Add new Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurPDbtSplitPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        ...basePayloads,
        PDbtSplitDate: currentDate,
        SplitQty: createValues[0],
        Remarks: createValues[1],
      },
      {
        key: "PDbtSplitKey",
        num: "PDbtSplitNum",
      }
    );
    pdbtSplitKey = key;
    pdbtSplitNum = num;
  });

  test("Get Pre Nursery Doubleton Splitting transaction by HdrKey", async ({
    api,
  }) => {
    const keyToUse = pdbtSplitKey || savedKey;
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPDbtSplit?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getAll();
  });

  test("Get all Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPDbtSplit?$format=json&$orderby=PDbtSplitDate%20desc,PDbtSplitKey&$select=PDbtSplitKey,PDbtSplitNum,StatusDesc,OUCode,NurBatchCodeDesc,SplitQty,PDbtSplitDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(PDbtSplitDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20PDbtSplitDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const keyToUse = pdbtSplitKey || savedKey;
    const docNoToUse = pdbtSplitNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurPDbtSplitPost`);

    const { status, json } = await apiObj.update("POST", {
      ...basePayloads,
      PDbtSplitKey: keyToUse,
      PDbtSplitNum: docNoToUse,
      PDbtSplitDate: currentDate,
      SplitQty: editValues[0],
      Remarks: editValues[1],
      RowState: 2,
    });
  });

  test("Delete Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const keyToUse = pdbtSplitKey || savedKey;
    apiObj.setUrl(`${nurUrl}/nur/api/NurPDbtSplitPost?key=${keyToUse}`);

    await apiObj.delete();
  });
});
