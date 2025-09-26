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
let pinterOUTrnKey, ipTrnNum, ouKey, transTypeKey;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Inter OU Pre Nursery Transfer To";
const basePayloads = NurseryPayloads.InterOUPreNurseryTransferTo;
const savedKey = ID.InterOUPreNurseryTransferTo.key;
const savedDocNo = ID.InterOUPreNurseryTransferTo.num;
const savedOUKey = ID.InterOUPreNurseryTransferTo.ou;
const savedTransTypeKey = ID.InterOUPreNurseryTransferTo.transType;

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
    apiObj.setUrl(`${nurUrl}/nur/api/NurInterPTrnPost`);

    const { key, num, ou, transType, status, json } = await apiObj.create(
      {
        ...basePayloads,
        TrnDate: currentDate,
        Remarks: createValues[0],
        TransTypeKey: createValues[1],
        IsToPre: createValues[2],
        STQty: createValues[3],
        DTQty: createValues[4],
        UnitPrice: createValues[5],
        AccKey: createValues[6],
        ToNurBatchKey: createValues[7],
      },
      {
        key: "PInterOUTrnKey",
        num: "IPTrnNum",
        ou: "FromOUKey",
        transType: "TransTypeKey",
      }
    );

    pinterOUTrnKey = key;
    ipTrnNum = num;
    ouKey = ou;
    transTypeKey = transType;
  });

  test("Get Inter-OU Pre Nursery Transfer To by HdrKey", async ({ api }) => {
    const keyToUse = pinterOUTrnKey || savedKey;

    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurInterPTrn?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurInterPTrn?$format=json&$orderby=TrnDate%20desc,PInterOUTrnKey&$select=PInterOUTrnKey,IPTrnNum,StatusDesc,FromOUCode,ToOUCode,NurBatchCodeDesc,AccNum,CCIDCode,STQty,DTQty,Remarks,TrnDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FromOUCode%20eq%20%27PMCE%27%20and%20(TrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20TrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    const keyToUse = pinterOUTrnKey || savedKey;
    const docNoToUse = ipTrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurInterPTrnPost`);
    const { key, num, ou, transType, status, json } = await apiObj.update(
      "POST",
      {
        ...basePayloads,
        PInterOUTrnKey: keyToUse,
        TrnDate: currentDate,
        IPTrnNum: docNoToUse,
        FromOUKey: ouToUse,
        Remarks: editValues[0],
        TransTypeKey: editValues[1],
        IsToPre: editValues[2],
        STQty: editValues[3],
        DTQty: editValues[4],
        UnitPrice: editValues[5],
        AccKey: editValues[6],
        CCIDKey: editValues[7],
        ToNurBatchKey: -1,
        RowState: 2,
      },
      true,
      {
        key: "PInterOUTrnKey",
        num: "IPTrnNum",
        ou: "FromOUKey",
        transType: "TransTypeKey",
      }
    );

    transTypeKey = transType;
  });

  test("Delete Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    const keyToUse = pinterOUTrnKey || savedKey;
    const ouToUse = ouKey || savedOUKey;
    const transTypeToUse = transTypeKey || savedTransTypeKey;

    apiObj.setUrl(
      `${nurUrl}/nur/api/NurInterPTrnPost?OUKey=${ouToUse}&TransTypeKey=${transTypeToUse}&key=${keyToUse}`
    );

    await apiObj.delete();
  });
});
