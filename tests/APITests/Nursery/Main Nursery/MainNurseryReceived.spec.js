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
let mrcvKey, mrcvNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Received";
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

    apiObj = new NurseryApi(null, "", formName, NurseryJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test("Add new Main Nursery Received transaction", async ({ api }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurRcvPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        MRcvKey: 529,
        ClientKey: 0,
        OUKey: 16,
        OUCode: "",
        OUDesc: "",
        OUCodeOUDesc: "",
        CompKey: 0,
        MRcvNum: "",
        NurBatchKey: 138,
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "",
        PlantSourceKey: 3,
        PlantSourceCode: "",
        PlantSourceDesc: "",
        PlantSourceCodeDesc: "",
        MRcvDate: currentDate,
        SgtQty: createValues[0],
        DbtQty: createValues[1],
        PreNTrnNo: createValues[2],
        RefNo: createValues[3],
        MRcvInd: createValues[4],
        RcvFrm: "Supplier",
        Remarks: createValues[5],
        Status: "O",
        StatusDesc: "OPEN",
        PInterOUTrnKey: 0,
        IsTransferFromInterPre: false,
        MInterOUTrnKey: 0,
        IsTransferFromInterMain: false,
        CreatedBy: 6,
        CreatedByCode: "LMSUPPORT",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-29T11:36:26.527849",
        UpdatedBy: 6,
        UpdatedDate: "2025-08-29T03:36:26.527849Z",
        UpdatedByCode: "LMSUPPORT",
        UpdatedByDesc: "lmsupport",
        MSeedling: 0.0,
        CullQty: 0.0,
        TrnQty: 0.0,
        SoldQty: 0.0,
        IsFromPTrn: false,
        RowState: 1,
      },
      { key: "MRcvKey", num: "MRcvNum" }
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
      MRcvKey: `${keyToUse}`,
      ClientKey: 0,
      OUKey: 16,
      OUCode: "",
      OUDesc: "",
      OUCodeOUDesc: "",
      CompKey: 1,
      MRcvNum: `${docNoToUse}`,
      NurBatchKey: 138,
      NurBatchCode: "",
      NurBatchDesc: "",
      NurBatchCodeDesc: "",
      PlantSourceKey: 3,
      PlantSourceCode: "",
      PlantSourceDesc: "",
      PlantSourceCodeDesc: "",
      MRcvDate: currentDate,
      SgtQty: editValues[0],
      DbtQty: editValues[1],
      PreNTrnNo: editValues[2],
      RefNo: editValues[3],
      MRcvInd: editValues[4],
      RcvFrm: "Supplier",
      Remarks: editValues[5],
      Status: "O",
      StatusDesc: "OPEN",
      PInterOUTrnKey: 0,
      IsTransferFromInterPre: false,
      MInterOUTrnKey: 0,
      IsTransferFromInterMain: false,
      CreatedBy: 6,
      CreatedByCode: "LMSUPPORT",
      CreatedByDesc: "lmsupport",
      CreatedDate: "2025-08-29T11:46:02.67",
      UpdatedBy: 6,
      UpdatedDate: "2025-08-29T03:47:34.435823Z",
      UpdatedByCode: "LMSUPPORT",
      UpdatedByDesc: "lmsupport",
      MSeedling: 10345.0,
      CullQty: 0.0,
      TrnQty: 0.0,
      SoldQty: 0.0,
      IsFromPTrn: false,
      RowState: 2,
    });
  });

  test("Delete Main Nursery Received transaction", async ({ api }) => {
    const keyToUse = mrcvKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/NurRcvPost?key=${keyToUse}`);
    await apiObj.delete();
  });
});
