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
let ptrnKey, ptrnNum, ouKey, transTypeKey;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Transfer/Sold/Loss";
const savedKey = ID.PreNurseryTransferSoldLoss.key;
const savedDocNo = ID.PreNurseryTransferSoldLoss.num;
const savedOUKey = ID.PreNurseryTransferSoldLoss.ou;
const savedTransTypeKey = ID.PreNurseryTransferSoldLoss.transType;

test.describe.serial("Pre Nursery Transfer/Sold/Loss API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );

    apiObj = new NurseryApi(
      null,
      "",
      "PreNurseryTransferSoldLoss",
      NurseryJsonPath
    );
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test("Add new Pre Nursery Transfer/Sold/Loss transaction", async ({
    api,
  }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurPTrnPost`);

    const { key, num, ou, transType, status, json } = await apiObj.create(
      {
        PTrnKey: 64,
        PTrnNum: "",
        TrnSID: "",
        TrnDate: currentDate,
        TrnQty: createValues[0],
        Remarks: createValues[1],
        DbtQty: createValues[2],
        NurBatchKey: 138,
        Status: "O",
        TransTypeKey: createValues[3],
        SoldToAccKey: createValues[4],
        ClientKey: 0,
        OUKey: 16,
        CompKey: 0,
        CCIDKey: createValues[5],
        CreatedBy: 6,
        CreatedByCode: "LMSUPPORT",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-28T11:23:31.6311136",
        LastUpdatedBy: 6,
        LastUpdatedDate: "2025-08-28T03:23:31.6311136Z",
        LastUpdatedByCode: "LMSUPPORT",
        LastUpdatedByDesc: "lmsupport",
        OUDesc: "",
        OUCode: "",
        OUCodeOUDesc: "",
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "PA001 - PA BATCH 1",
        SoldToAccNum: "",
        StatusDesc: "OPEN",
        CCIDCode: "",
        TrnToBatchKey: -1,
        IsOwnBatch: false,
        PlantSourceKey: 3,
        ContactKey: -1,
        RowState: 1,
        BuyerCodeDesc: "",
        TransTypeDesc: "",
        IsApplied: false,
        IsAppliedRequisition: false,
        SoldDetKey: -1,
        TransferHdrKey: -1,
      },
      { key: "PTrnKey", num: "PTrnNum", ou: "OUKey", transType: "TransTypeKey" }
    );

    ptrnKey = key;
    ptrnNum = num;
    ouKey = ou;
    transTypeKey = transType;
  });

  test("Get Pre Nursery Transfer/Sold/Loss by HdrKey", async ({ api }) => {
    const keyToUse = ptrnKey || savedKey;

    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPTrn?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Pre Nursery Transfer/Sold/Loss transaction", async ({
    api,
  }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPTrn?$format=json&$orderby=TrnDate%20desc,PTrnKey&$select=PTrnKey,PTrnNum,StatusDesc,OUCode,NurBatchCodeDesc,SoldToAccNum,CCIDCode,TrnQty,DbtQty,Remarks,TrnDate,BuyerCodeDesc,TransTypeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(TrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20TrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Pre Nursery Transfer/Sold/Loss transaction", async ({ api }) => {
    const keyToUse = ptrnKey || savedKey;
    const docNoToUse = ptrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurPTrnPost`);
    const { key, num, ou, transType, status, json } = await apiObj.update(
      "POST",
      {
        PTrnKey: `${keyToUse}`,
        PTrnNum: `${docNoToUse}`,
        TrnSID: "",
        TrnDate: currentDate,
        TrnQty: editValues[0],
        Remarks: editValues[1],
        DbtQty: editValues[2],
        NurBatchKey: 138,
        Status: "O",
        TransTypeKey: editValues[3],
        SoldToAccKey: -1,
        ClientKey: 0,
        OUKey: `${ouToUse}`,
        CompKey: 0,
        CCIDKey: -1,
        CreatedBy: 6,
        CreatedByCode: "LMSUPPORT",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-28T11:23:31.6311136",
        LastUpdatedBy: 6,
        LastUpdatedDate: "2025-08-28T03:23:31.6311136Z",
        LastUpdatedByCode: "LMSUPPORT",
        LastUpdatedByDesc: "lmsupport",
        OUDesc: "",
        OUCode: "",
        OUCodeOUDesc: "",
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "PA001 - PA BATCH 1",
        SoldToAccNum: "",
        StatusDesc: "OPEN",
        CCIDCode: "",
        TrnToBatchKey: editValues[4],
        IsOwnBatch: false,
        PlantSourceKey: 3,
        ContactKey: -1,
        RowState: 2,
        BuyerCodeDesc: "",
        TransTypeDesc: "",
        IsApplied: false,
        IsAppliedRequisition: false,
        SoldDetKey: -1,
        TransferHdrKey: -1,
      },
      true,
      {
        key: "PTrnKey",
        num: "PTrnNum",
        ou: "OUKey",
        transType: "TransTypeKey",
      }
    );
  });

  test("Delete Pre Nursery Transfer/Sold/Loss transaction", async ({ api }) => {
    const keyToUse = ptrnKey || savedKey;
    const docNoToUse = ptrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;
    const transTypeToUse = transTypeKey || savedTransTypeKey;

    apiObj.setUrl(
      `${nurUrl}/nur/api/NurPTrnPost?OUKey=${ouToUse}&PTrnNum=${docNoToUse}&TransTypeKey=${transTypeToUse}&key=${keyToUse}`
    );
    await apiObj.delete();
  });
});
