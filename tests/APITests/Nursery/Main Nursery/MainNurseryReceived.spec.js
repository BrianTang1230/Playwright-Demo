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
let mrcvKey, mrcvNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Received";
const basePayloads = NurseryPayloads.MainNurseryReceived;
const savedKey = ID.MainNurseryReceived.key;
const savedDocNo = ID.MainNurseryReceived.num;

test.describe.serial("Main Nursery Received API Test", () => {
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

  test("Add new Main Nursery Received transaction", async ({ api }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurRcvPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        ...basePayloads,
        MRcvDate: currentDate,
        SgtQty: createValues[0],
        DbtQty: createValues[1],
        PreNTrnNo: createValues[2],
        RefNo: createValues[3],
        MRcvInd: createValues[4],
        Remarks: createValues[5],
      },
      {
        key: "MRcvKey",
        num: "MRcvNum",
      }
    );
    mrcvKey = key;
    mrcvNum = num;
  });

  test("Get Main Nursery Received by HdrKey", async ({ api }) => {
    const keyToUse = mrcvKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/odata/NurRcv?HdrKey=${keyToUse}&$format=json`);
    await apiObj.getByKey();
  });

  test("Get all Main Nursery Received transaction", async ({ api }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurRcv?$format=json&$orderby=MRcvDate%20desc,MRcvKey&$select=MRcvKey,MRcvNum,StatusDesc,OUCode,NurBatchCodeDesc,SgtQty,DbtQty,Remarks,MRcvDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(MRcvDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20MRcvDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Main Nursery Received transaction", async ({ api }) => {
    const keyToUse = mrcvKey || savedKey;
    const docNoToUse = mrcvNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurRcvPost`);

    const { status, json } = await apiObj.update("POST", {
      ...basePayloads,
      MRcvKey: `${keyToUse}`,
      MRcvNum: `${docNoToUse}`,
      MRcvDate: currentDate,
      SgtQty: editValues[0],
      DbtQty: editValues[1],
      PreNTrnNo: editValues[2],
      RefNo: editValues[3],
      MRcvInd: editValues[4],
      Remarks: editValues[5],
      RowState: 2,
    });
  });

  test("Delete Main Nursery Received transaction", async ({ api }) => {
    const keyToUse = mrcvKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurRcvPost?key=${keyToUse}`);

    await apiObj.delete();
  });
});
