import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import {
  JsonPath,
  NUR_API_URL,
  ID,
} from "@utils/data/apidata/nurseryApiData.json";
import { setGlobal, apiCall } from "@ApiFolder/apiUtils/apiHelpers.js";
import editJson from "@utils/commonFunctions/EditJson";
import { loadExcelData } from "@utils/commonFunctions/LoadExcel";

let pinterOUTrnKey;
let ipTrnNum;
let ouKey;
let transTypeKey;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Inter OU Pre Nursery Transfer To";
const savedKey = ID.InterOUPreNurseryTransferTo.key;
const savedDocNo = ID.InterOUPreNurseryTransferTo.num;
const savedOUKey = ID.InterOUPreNurseryTransferTo.ou;
const savedTransTypeKey = ID.InterOUPreNurseryTransferTo.transType;

async function handleSetAndEditJson(json) {
  if (!json) return;

  const { key, num, ou, transType } = await setGlobal("preNursery", json, {
    key: "PInterOUTrnKey",
    num: "IPTrnNum",
    ou: "FromOUKey",
    transType: "TransTypeKey",
  });

  pinterOUTrnKey = key;
  ipTrnNum = num;
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
    api,
  }) => {
    const { json } = await apiCall(
      api,
      "POST", // <-- method
      `${url}/nur/api/NurInterPTrnPost`, // <-- URL
      {
        data: {
          PInterOUTrnKey: 1,
          TrnDate: currentDate,
          ClientKey: 0,
          IPTrnNum: "",
          FromOUKey: 16,
          FromOUDesc: "",
          FromOUCode: "",
          FromOUCodeOUDesc: "",
          ToOUKey: 2,
          ToOUDesc: "",
          ToOUCode: "",
          ToOUCodeOUDesc: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          PlantSourceKey: 3,
          PlantMateKey: 9,
          Status: "O",
          StatusDesc: "OPEN",
          Remarks: createValues[0],
          TransTypeKey: createValues[1],
          TransTypeDesc: "",
          IsToPre: createValues[2],
          STQty: createValues[3],
          DTQty: createValues[4],
          UnitPriceType: "SD",
          UnitPrice: createValues[5],
          UnitPriceCalcCost: 0.0,
          UnitPriceCalcQty: 0.0,
          TrnAmt: 0.0,
          AccKey: createValues[6],
          AccNum: "21111011",
          CCIDKey: -1,
          CCIDCode: "",
          CCIDCodeDesc: "",
          ToNurBatchKey: createValues[7],
          ToNurBatchCode: "",
          ToNurBatchDesc: "",
          ToNurBatchCodeDesc: "",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T10:02:40.9507889",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-29T02:02:40.9507889Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 1,
          IsApplied: false,
          IsApplyRequisition: false,
          TransferHdrKey: -1,
        },
      },
      [200, 201] // <-- expected status codes
    );

    if (json) {
      await handleSetAndEditJson(json);
    }
  });

  test("Get Inter-OU Pre Nursery Transfer To by HdrKey", async ({ api }) => {
    const keyToUse = pinterOUTrnKey || savedKey;
    await apiCall(
      api,
      "GET",
      `${url}/nur/odata/NurInterPTrn?HdrKey=${keyToUse}&$format=json`,
      {},
      [200]
    );
  });

  test("Get all Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    await apiCall(
      api,
      "GET",
      `${url}/nur/odata/NurInterPTrn?$format=json&$orderby=TrnDate%20desc,PInterOUTrnKey&$select=PInterOUTrnKey,IPTrnNum,StatusDesc,FromOUCode,ToOUCode,NurBatchCodeDesc,AccNum,CCIDCode,STQty,DTQty,Remarks,TrnDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FromOUCode%20eq%20%27PMCE%27%20and%20(TrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20TrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      {},
      [200]
    );
  });

  test("Update Inter-OU Pre Nursery Transfer To transaction", async ({
    api,
  }) => {
    const keyToUse = pinterOUTrnKey || savedKey;
    const docNoToUse = ipTrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;

    const { json } = await apiCall(
      api,
      "POST",
      `${url}/nur/api/NurInterPTrnPost`,
      {
        data: {
          PInterOUTrnKey: `${keyToUse}`,
          TrnDate: currentDate,
          ClientKey: 1,
          IPTrnNum: `${docNoToUse}`,
          FromOUKey: `${ouToUse}`,
          FromOUDesc: "",
          FromOUCode: "",
          FromOUCodeOUDesc: "",
          ToOUKey: 2,
          ToOUDesc: "BATU ANAM ESTATE",
          ToOUCode: "PBAE",
          ToOUCodeOUDesc: "PBAE - BATU ANAM ESTATE",
          NurBatchKey: 138,
          NurBatchCode: "PA001",
          NurBatchDesc: "PA BATCH 1",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          PlantSourceKey: -1,
          PlantMateKey: -1,
          Status: "O",
          StatusDesc: "OPEN",
          Remarks: editValues[0],
          TransTypeKey: editValues[1],
          TransTypeDesc: "",
          IsToPre: editValues[2],
          STQty: editValues[3],
          DTQty: editValues[4],
          UnitPriceType: "SD",
          UnitPrice: editValues[5],
          UnitPriceCalcCost: 0.0,
          UnitPriceCalcQty: 0.0,
          TrnAmt: 0.0,
          AccKey: editValues[6],
          AccNum: "",
          CCIDKey: editValues[7],
          CCIDCode: "",
          CCIDCodeDesc: "",
          ToNurBatchKey: -1,
          ToNurBatchCode: "NUR2021A",
          ToNurBatchDesc: "NURSERY BATCH 2021A",
          ToNurBatchCodeDesc: "NUR2021A - NURSERY BATCH 2021A",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T10:16:02.63",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-29T02:41:56.8733603Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 2,
          IsApplied: false,
          IsApplyRequisition: false,
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
    api,
  }) => {
    const keyToUse = pinterOUTrnKey || savedKey;
    const ouToUse = ouKey || savedOUKey;
    const transTypeToUse = transTypeKey || savedTransTypeKey;

    await apiCall(
      api,
      "DELETE",
      `${url}/nur/api/NurInterPTrnPost?OUKey=${ouToUse}&TransTypeKey=${transTypeToUse}&key=${keyToUse}`,
      {},
      [204]
    );
  });
});
