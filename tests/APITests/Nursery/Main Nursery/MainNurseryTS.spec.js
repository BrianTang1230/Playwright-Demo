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
let mtrnKey, mtrnNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Transfer/Loss";
const savedKey = ID.MainNurseryTransferLoss.key;
const savedDocNo = ID.MainNurseryTransferLoss.num;

test.describe.serial("Main Nursery Transfer/Loss API Test", () => {
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

  test("Add new Main Nursery Transfer/Loss transaction", async ({ api }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurTrnPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        MTrnKey: 252,
        ClientKey: 0,
        OUKey: 16,
        OUCode: "",
        OUDesc: "",
        OUCodeOUDesc: "",
        CompKey: 0,
        MTrnNum: "",
        NurBatchKey: 138,
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "PA001 - PA BATCH 1",
        BlockKey: -1,
        BlockCode: "",
        BlockDesc: "",
        BlockCodeBlockDesc: "",
        MTrnDate: currentDate,
        TrnQty: createValues[0],
        Remarks: createValues[1],
        Status: "O",
        StatusDesc: "OPEN",
        Type: "Mature",
        CreatedBy: 6,
        CreatedByCode: "LMSUPPORT",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-29T14:07:54.6896999",
        UpdatedBy: 6,
        UpdatedDate: "2025-08-29T06:07:54.6896999Z",
        UpdatedByCode: "LMSUPPORT",
        UpdatedByDesc: "lmsupport",
        MSeedling: 7345.0,
        Split: false,
        AccKey: createValues[2],
        AccCodeAccDesc: "",
        AccNum: "",
        RowState: 1,
        ContactKey: -1,
        TransTypeKey: createValues[3],
        CropKey: 1,
        TransTypeDesc: "",
        IsAppliedRequisition: false,
        TransferHdrKey: -1,
      },
      { key: "MTrnKey", num: "MTrnNum" }
    );

    mtrnKey = key;
    mtrnNum = num;
  });

  test("Get Main Nursery Transfer/Loss by HdrKey", async ({ api }) => {
    const keyToUse = mtrnKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/odata/NurTrn?HdrKey=${keyToUse}&$format=json`);
    await apiObj.getByKey();
  });

  test("Get all Main Nursery Transfer/Loss transaction", async ({ api }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurTrn?$format=json&$orderby=MTrnDate%20desc,MTrnKey&$select=MTrnKey,MTrnNum,StatusDesc,OUCode,NurBatchCodeDesc,Type,BlockCode,TrnQty,MTrnDate,AccNum,AccCodeAccDesc,TransTypeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(MTrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20MTrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Main Nursery Transfer/Loss transaction", async ({ api }) => {
    const keyToUse = mtrnKey || savedKey;
    const docNoToUse = mtrnNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurTrnPost`);
    const { status, json } = await apiObj.update("POST", {
      MTrnKey: `${keyToUse}`,
      ClientKey: 0,
      OUKey: 16,
      OUCode: "",
      OUDesc: "",
      OUCodeOUDesc: "",
      CompKey: 1,
      MTrnNum: `${docNoToUse}`,
      NurBatchKey: 138,
      NurBatchCode: "",
      NurBatchDesc: "",
      NurBatchCodeDesc: "PA001 - PA BATCH 1",
      BlockKey: editValues[0],
      BlockCode: "",
      BlockDesc: "",
      BlockCodeBlockDesc: "",
      MTrnDate: currentDate,
      TrnQty: editValues[1],
      Remarks: editValues[2],
      Status: "O",
      StatusDesc: "OPEN",
      Type: "",
      CreatedBy: 6,
      CreatedByCode: "LMSUPPORT",
      CreatedByDesc: "lmsupport",
      CreatedDate: "2025-08-29T14:07:54.69",
      UpdatedBy: 6,
      UpdatedDate: "2025-08-29T06:08:23.6637202Z",
      UpdatedByCode: "LMSUPPORT",
      UpdatedByDesc: "lmsupport",
      MSeedling: 7345.0,
      Split: false,
      AccKey: editValues[3],
      AccCodeAccDesc: "",
      AccNum: "",
      RowState: 2,
      ContactKey: -1,
      TransTypeKey: editValues[4],
      CropKey: 1,
      TransTypeDesc: "",
      IsAppliedRequisition: false,
      TransferHdrKey: -1,
    });
  });

  test("Delete Main Nursery Transfer/Loss transaction", async ({ api }) => {
    const keyToUse = mtrnKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurTrnPost?key=${keyToUse}`);
    await apiObj.delete();
  });
});
