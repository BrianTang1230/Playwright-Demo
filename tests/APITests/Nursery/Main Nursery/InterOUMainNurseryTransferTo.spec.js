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
let mInterOUTrnKey, imTrnNum, ouKey, transTypeKey;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Inter OU Main Nursery Transfer To";
const basePayloads = NurseryPayloads.InterOUMainNurseryTransferTo;
const savedKey = ID.InterOUMainNurseryTransferTo.key;
const savedDocNo = ID.InterOUMainNurseryTransferTo.num;
const savedOUKey = ID.InterOUMainNurseryTransferTo.ou;
const savedTransTypeKey = ID.InterOUMainNurseryTransferTo.transType;

test.describe.serial("Inter-OU Pre Nursery Transfer To API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
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

  test("Add new Inter OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurInterMTrnPost`);

    const { key, num, ou, transType, status, json } = await apiObj.create(
      {
        ...basePayloads,
        TrnDate: currentDate,
        Remarks: createValues[0],
        TransTypeKey: createValues[1],
        STQty: createValues[2],
        UnitPrice: createValues[3],
        AccKey: createValues[4],
        CCIDKey: createValues[5],
      },
      {
        key: "MInterOUTrnKey",
        num: "IMTrnNum",
        ou: "FromOUKey",
        transType: "TransTypeKey",
      }
    );

    mInterOUTrnKey = key;
    imTrnNum = num;
    ouKey = ou;
    transTypeKey = transType;
  });

  test("Get Inter-OU Pre Nursery Transfer To by HdrKey", async ({ api }) => {
    const keyToUse = mInterOUTrnKey || savedKey;
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurInterMTrn?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurInterMTrn?$format=json&$orderby=TrnDate%20desc,MInterOUTrnKey&$select=MInterOUTrnKey,IMTrnNum,StatusDesc,FromOUCode,ToOUCode,NurBatchCodeDesc,ToNurBatchCodeDesc,CCIDCodeDesc,STQty,TrnDate,AccNum,AccCodeAccDesc,TransTypeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FromOUCode%20eq%20%27PMCE%27%20and%20(TrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20TrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    const keyToUse = mInterOUTrnKey || savedKey;
    const docNoToUse = imTrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurInterMTrnPost`);
    const { key, num, ou, transType, status, json } = await apiObj.update(
      "POST",
      {
        ...basePayloads,
        MInterOUTrnKey: keyToUse,
        TrnDate: currentDate,
        IMTrnNum: docNoToUse,
        FromOUKey: ouToUse,
        ToNurBatchKey: editValues[0],
        TransTypeKey: editValues[2],
        STQty: editValues[3],
        UnitPrice: editValues[4],
        AccKey: editValues[5],
        CCIDKey: -1,
        RowState: 2,
      },
      true,
      {
        key: "MInterOUTrnKey",
        num: "IMTrnNum",
        ou: "FromOUKey",
        transType: "TransTypeKey",
      }
    );

    transTypeKey = transType;
  });

  test("Delete Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    const keyToUse = mInterOUTrnKey || savedKey;
    const ouToUse = ouKey || savedOUKey;
    const transTypeToUse = transTypeKey || savedTransTypeKey;

    apiObj.setUrl(
      `${nurUrl}/nur/api/NurInterMTrnPost?OUKey=${ouToUse}&TransTypeKey=${transTypeToUse}&key=${keyToUse}`
    );
    await apiObj.delete();
  });
});
