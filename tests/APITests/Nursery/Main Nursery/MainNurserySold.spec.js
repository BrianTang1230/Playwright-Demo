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
let mSoldKey, mSoldNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Sold";
const basePayloads = NurseryPayloads.MainNurserySold;
const savedKey = ID.MainNurserySold.key;
const savedDocNo = ID.MainNurserySold.num;

test.describe.serial("Main Nursery Sold", () => {
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

  test("Add new Main Nursery Sold transaction", async ({ api }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurMainSoldPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        ...basePayloads,
        SoldDate: currentDate,
        SoldQty: createValues[0],
        Remarks: createValues[1],
        SoldToAccKey: createValues[2],
        CCIDKey: createValues[3],
        ContactKey: createValues[4],
      },
      {
        key: "MSoldKey",
        num: "MSoldNum",
      }
    );

    mSoldKey = key;
    mSoldNum = num;
  });

  test("Get Main Nursery Sold transaction by HdrKey", async ({ api }) => {
    const keyToUse = mSoldKey || savedKey;
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurMainSold?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Main Nursery Sold transaction", async ({ api }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurMainSold?$format=json&$orderby=SoldDate%20desc,MSoldKey&$select=MSoldKey,StatusDesc,OUCode,NurBatchCodeDesc,SoldToAccNum,SoldToAccNumAccDesc,CCIDCodeCCIDDesc,SoldQty,Remarks,SoldDate,MSoldNum,BuyerCodeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(SoldDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20SoldDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Main Nursery Sold transaction", async ({ api }) => {
    const keyToUse = mSoldKey || savedKey;
    const docNoToUse = mSoldNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurMainSoldPost`);

    const { status, json } = await apiObj.update("POST", {
      ...basePayloads,
      MSoldKey: `${keyToUse}`,
      SoldDate: currentDate,
      MSoldNum: `${docNoToUse}`,
      SoldQty: editValues[0],
      Remarks: editValues[1],
      SoldToAccKey: editValues[2],
      CCIDKey: editValues[3],
      ContactKey: editValues[4],
      RowState: 2,
    });
  });

  test("Delete Main Nursery Sold transaction", async ({ api }) => {
    const keyToUse = mSoldKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurMainSoldPost?key=${keyToUse}`);

    await apiObj.delete();
  });
});
