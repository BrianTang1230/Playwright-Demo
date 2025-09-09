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
import { create } from "domain";

let mtrnKey;
let mtrnNum;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Transfer/Loss";
const savedKey = ID.MainNurseryTransferLoss.key;
const savedDocNo = ID.MainNurseryTransferLoss.num;

test.describe.serial("Main Nursery Transfer/Loss API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    createValues = (
      await excel.readExcel(sheetName, formName, "CreateAPIData", false)
    ).split(";");
    editValues = (
      await excel.readExcel(sheetName, formName, "EditAPIData", false)
    ).split(";");
  });

  test("Add new Main Nursery Transfer/Loss transaction", async ({
    request,
    authToken,
  }) => {
    const { status, json } = await apiCall(
      request,
      "POST", // <-- method
      `${url}/nur/api/NurTrnPost`, // <-- URL
      authToken,
      {
        data: {
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
      },
      [200, 201] // <-- expected status codes
    );

    if (json) {
      const { key, num } = await setGlobal("mainNursery", json, {
        key: "MTrnKey",
        num: "MTrnNum",
      });

      // update globals
      mtrnKey = key;
      mtrnNum = num;

      // write to JSON file
      editJson(JsonPath, "MainNurseryTransferLoss", { key, num }, false);
    }
  });

  test("Get Main Nursery Transfer/Loss by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mtrnKey || savedKey;
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurTrn?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Main Nursery Transfer/Loss transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurTrn?$format=json&$orderby=MTrnDate%20desc,MTrnKey&$select=MTrnKey,MTrnNum,StatusDesc,OUCode,NurBatchCodeDesc,Type,BlockCode,TrnQty,MTrnDate,AccNum,AccCodeAccDesc,TransTypeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(MTrnDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20MTrnDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Main Nursery Transfer/Loss transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mtrnKey || savedKey;
    const docNoToUse = mtrnNum || savedDocNo;

    await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurTrnPost`,
      authToken,
      {
        data: {
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
        },
      },
      [200, 204]
    );
  });

  test("Delete Main Nursery Transfer/Loss transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mtrnKey || savedKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/NurTrnPost?key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
