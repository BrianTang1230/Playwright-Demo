import { expect } from "@playwright/test";
import { test } from "@ApiFolder/apiUtils/Fixtures.js";
import ConnectExcel from "@utils/excel/ConnectExcel";
import {
  JsonPath,
  NUR_API_URL,
  ID,
} from "@utils/data/apidata/nurseryApiData.json";
import {
  handleApiResponse,
  setGlobal,
  authHeaders,
} from "@ApiFolder/apiUtils/apiHelpers.js";
import editJson from "@utils/commonFunctions/EditJson";
import { apiCall } from "testsfolders/ApiTestsFolder/apiUtils/apiHelpers";

let pCullKey;
let pCullNum;
let connectExcel;
let createValues;
let editValues;
const currentDate = new Date().toISOString();

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Culling";
const savedKey = ID.PreNurseryCulling.key;
const savedDocNo = ID.PreNurseryCulling.num;

test.describe.serial("Pre Nursery Culling API Test", () => {
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

  test("@api Add new Pre Nursery Culling transaction", async ({
    request,
    authToken,
  }) => {
    const { status, json } = await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurPCullPost`,
      authToken,
      {
        data: {
          PCullKey: 146,
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          PCullNum: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          PCReasonKey: -1,
          PCReasonCode: "",
          PCReasonDesc: "",
          PCReasonCodeDesc: "",
          CullDate: currentDate,
          PCullDate: "0001-01-01T00:00:00",
          PCullQty: createValues[0],
          PCullSTQty: createValues[1],
          PCullDTQty: createValues[2],
          Remarks: createValues[3],
          Status: "O",
          StatusDesc: "OPEN",
          Stage: "After Germinated",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-22T15:21:45.2224647",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-22T07:21:45.2224647Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          RowState: 1,
        },
      },
      [200, 201]
    );

    if (json) {
      // Call your dynamic setter
      const { key, num } = await setGlobal("preNursery", json, {
        key: "PCullKey",
        num: "PCullNum",
      });

      pCullKey = key;
      pCullNum = num;

      editJson(JsonPath, formName, { key: pCullKey, num: pCullNum }, false);
    }
  });

  test("@api Get Pre Nursery Culling transaction by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = pCullKey || savedKey;

    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPCull?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("@api Get all Pre Nursery Culling transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPCull?$format=json&$orderby=PCullDate%20desc,PCullKey&$select=PCullKey,PCullNum,StatusDesc,OUCode,NurBatchCodeDesc,PCullQty,PCullSTQty,PCullDTQty,PCullDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(PCullDate%20ge%20datetime%272025-08-01T00%3A00%3A00%27%20and%20PCullDate%20le%20datetime%272025-08-31T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("@api Update Pre Nursery Culling transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = pCullKey || savedKey;
    const docNoToUse = pCullNum || savedDocNo;

    await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurPCullPost`,
      authToken,
      {
        data: {
          PCullKey: `${keyToUse}`,
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          PCullNum: `${docNoToUse}`,
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          PCReasonKey: -1,
          PCReasonCode: "",
          PCReasonDesc: "",
          PCReasonCodeDesc: "",
          CullDate: currentDate,
          PCullDate: "0001-01-01T00:00:00",
          PCullQty: editValues[0],
          PCullSTQty: editValues[1],
          PCullDTQty: editValues[2],
          Remarks: editValues[3],
          Status: "O",
          StatusDesc: "OPEN",
          Stage: "After Germinated",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-22T15:21:45.2224647",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-22T07:21:45.2224647Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          RowState: 2,
        },
      },
      [200, 204]
    );
  });

  test("@api Delete Pre Nursery Culling transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = pCullKey || savedKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/NurPCullPost?key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
