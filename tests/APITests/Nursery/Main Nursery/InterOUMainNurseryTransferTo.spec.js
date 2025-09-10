import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import {
  JsonPath,
  NUR_API_URL,
  ID,
} from "@utils/data/apidata/nurseryApiData.json";
import {
  setGlobal,
  apiCall,
} from "@ApiFolder/apiUtils/apiHelpers.js";
import editJson from "@utils/commonFunctions/EditJson";
import { loadExcelData } from "@utils/commonFunctions/LoadExcel";

let mInterOUTrnKey;
let imTrnNum;
let ouKey;
let transTypeKey;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Inter OU Main Nursery Transfer To";
const savedKey = ID.InterOUMainNurseryTransferTo.key;
const savedDocNo = ID.InterOUMainNurseryTransferTo.num;
const savedOUKey = ID.InterOUMainNurseryTransferTo.ou;
const savedTransTypeKey = ID.InterOUMainNurseryTransferTo.transType;

async function handleSetAndEditJson(json) {
  if (!json) return;

  const { key, num, ou, transType } = await setGlobal("mainNursery", json, {
    key: "MInterOUTrnKey",
    num: "IMTrnNum",
    ou: "FromOUKey",
    transType: "TransTypeKey",
  });

  mInterOUTrnKey = key;
  imTrnNum = num;
  ouKey = ou;
  transTypeKey = transType;

  // write to JSON file
  editJson(
    JsonPath,
    formName,
    {
      key,
      num,
      ou,
      transType,
    },
    false
  );
}

test.describe.serial("Inter-OU Pre Nursery Transfer To API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    const { create, edit } = await loadExcelData(
      excel,
      sheetName,
      formName,
      false
    );

    createValues = create;
    editValues = edit;
  });

  test("Add new Inter OU Pre Nursery Transfer To transaction", async ({
    request,
    authToken,
  }) => {
    const { json } = await apiCall(
      request,
      "POST", // <-- method
      `${url}/nur/api/NurInterMTrnPost`, // <-- URL
      authToken,
      {
        data: {
          MInterOUTrnKey: 1,
          TrnDate: currentDate,
          ClientKey: 0,
          IMTrnNum: "",
          FromOUKey: 16,
          FromOUCode: "",
          FromOUDesc: "",
          FromOUCodeOUDesc: "",
          ToOUKey: 2,
          ToOUCode: "",
          ToOUDesc: "",
          ToOUCodeOUDesc: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          ToNurBatchKey: -1,
          ToNurBatchCode: "",
          ToNurBatchDesc: "",
          ToNurBatchCodeDesc: "",
          PlantSourceKey: -1,
          Remarks: createValues[0],
          Status: "O",
          StatusDesc: "OPEN",
          TransTypeKey: createValues[1],
          TransTypeDesc: "",
          STQty: createValues[2],
          UnitPriceType: "SD",
          UnitPrice: createValues[3],
          UnitPriceCalcCost: 0.0,
          UnitPriceCalcQty: 0.0,
          TrnAmt: 0.0,
          AccKey: createValues[4],
          AccCodeAccDesc: "",
          AccNum: "",
          CCIDKey: createValues[5],
          CCIDCode: "",
          CCIDCodeDesc: "",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T15:48:12.230875",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-29T07:48:12.230875Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 1,
          IsAppliedRequisition: false,
          TransferHdrKey: -1,
        },
      },
      [200, 201] // <-- expected status codes
    );

    if (json) {
      await handleSetAndEditJson(json);
    }
  });

  test("Get Inter-OU Pre Nursery Transfer To by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mInterOUTrnKey || savedKey;
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurInterMTrn?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Inter-OU Pre Nursery Transfer To transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurInterMTrn?$format=json&$orderby=TrnDate%20desc,MInterOUTrnKey&$select=MInterOUTrnKey,IMTrnNum,StatusDesc,FromOUCode,ToOUCode,NurBatchCodeDesc,ToNurBatchCodeDesc,CCIDCodeDesc,STQty,TrnDate,AccNum,AccCodeAccDesc,TransTypeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FromOUCode%20eq%20%27PMCE%27%20and%20(TrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20TrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Inter-OU Pre Nursery Transfer To transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mInterOUTrnKey || savedKey;
    const docNoToUse = imTrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;

    const { json } = await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurInterMTrnPost`,
      authToken,
      {
        data: {
          MInterOUTrnKey: `${keyToUse}`,
          TrnDate: currentDate,
          ClientKey: 0,
          IMTrnNum: `${docNoToUse}`,
          FromOUKey: `${ouToUse}`,
          FromOUCode: "",
          FromOUDesc: "",
          FromOUCodeOUDesc: "",
          ToOUKey: 2,
          ToOUCode: "",
          ToOUDesc: "",
          ToOUCodeOUDesc: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          ToNurBatchKey: editValues[0],
          ToNurBatchCode: "",
          ToNurBatchDesc: "",
          ToNurBatchCodeDesc: "",
          PlantSourceKey: 3,
          Remarks: editValues[1],
          Status: "O",
          StatusDesc: "OPEN",
          TransTypeKey: editValues[2],
          TransTypeDesc: "",
          STQty: editValues[3],
          UnitPriceType: "SD",
          UnitPrice: editValues[4],
          UnitPriceCalcCost: 0.0,
          UnitPriceCalcQty: 0.0,
          TrnAmt: 0.0,
          AccKey: editValues[5],
          AccCodeAccDesc: "",
          AccNum: "",
          CCIDKey: -1,
          CCIDCode: "",
          CCIDCodeDesc: "",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T16:10:02.36",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-29T08:11:53.4927303Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 2,
          IsAppliedRequisition: false,
          TransferHdrKey: -1,
        },
      },
      [200, 204]
    );

    if (json) {
      await handleSetAndEditJson(json);
    }
  });

  test("Delete Inter-OU Pre Nursery Transfer To transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mInterOUTrnKey || savedKey;
    const ouToUse = ouKey || savedOUKey;
    const transTypeToUse = transTypeKey || savedTransTypeKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/NurInterMTrnPost?OUKey=${ouToUse}&TransTypeKey=${transTypeToUse}&key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
