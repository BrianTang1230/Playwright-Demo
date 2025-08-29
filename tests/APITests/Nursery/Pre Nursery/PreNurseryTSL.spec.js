import { expect } from "@playwright/test";
import { test } from "@ApiFolder/apiUtils/Fixtures.js";
import ConnectExcel from "@utils/excel/ConnectExcel";
import {
  JsonPath,
  NUR_API_URL,
  ID,
} from "@utils/data/apidata/nurseryApiData.json";
import { setGlobal, apiCall } from "@ApiFolder/apiUtils/apiHelpers.js";
import editJson from "@utils/commonFunctions/EditJson";
import { create } from "domain";

let ptrnKey;
let ptrnNum;
let ouKey;
let transTypeKey;
let connectExcel;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Transfer/Sold/Loss";
const savedKey = ID.PreNurseryTransferSoldLoss.key;
const savedDocNo = ID.PreNurseryTransferSoldLoss.num;
const savedOUKey = ID.PreNurseryTransferSoldLoss.ou;
const savedTransTypeKey = ID.PreNurseryTransferSoldLoss.transType;

async function handleSetAndEditJson(json) {
  if (!json) return;

  const { key, num, ou, transType } = await setGlobal("preNursery", json, {
    key: "PTrnKey",
    num: "PTrnNum",
    ou: "OUKey",
    transType: "TransTypeKey",
  });

  // update globals
  ptrnKey = key;
  ptrnNum = num;
  ouKey = ou;
  transTypeKey = transType;

  // write to JSON file
  editJson(
    JsonPath,
    "PreNurseryTransferSoldLoss",
    { key, num, ou, transType },
    false
  );
}

test.describe.serial("Pre Nursery Transfer/Sold/Loss API Test", () => {
  test.beforeAll(async () => {
    // Initialize Excel connection with the selected file
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init(false);

    // Read Excel data once
    createValues = (await connectExcel.readExcel("CreateAPIData", false)).split(
      ";"
    );
    editValues = (await connectExcel.readExcel("EditAPIData", false)).split(
      ";"
    );
  });

  test("Add new Pre Nursery Transfer/Sold/Loss transaction", async ({
    request,
    authToken,
  }) => {
    const { status, json } = await apiCall(
      request,
      "POST", // <-- method
      `${url}/nur/api/NurPTrnPost`, // <-- URL
      authToken,
      {
        data: {
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
      },
      [200, 201] // <-- expected status codes
    );

    if (json) {
      await handleSetAndEditJson(json);
    }
  });

  test("Get Pre Nursery Transfer/Sold/Loss by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = ptrnKey || savedKey;
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPTrn?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Pre Nursery Transfer/Sold/Loss transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPTrn?$format=json&$orderby=TrnDate%20desc,PTrnKey&$select=PTrnKey,PTrnNum,StatusDesc,OUCode,NurBatchCodeDesc,SoldToAccNum,CCIDCode,TrnQty,DbtQty,Remarks,TrnDate,BuyerCodeDesc,TransTypeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(TrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20TrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Pre Nursery Transfer/Sold/Loss transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = ptrnKey || savedKey;
    const docNoToUse = ptrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;

    const { status, json } = await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurPTrnPost`,
      authToken,
      {
        data: {
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
      },
      [200, 204]
    );
    if (json) {
      await handleSetAndEditJson(json);
    }
  });

  test("Delete Pre Nursery Transfer/Sold/Loss transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = ptrnKey || savedKey;
    const docNoToUse = ptrnNum || savedDocNo;
    const ouToUse = ouKey || savedOUKey;
    const transTypeToUse = transTypeKey || savedTransTypeKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/NurPTrnPost?OUKey=${ouToUse}&PTrnNum=${docNoToUse}&TransTypeKey=${transTypeToUse}&key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
