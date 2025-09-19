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

let ncMainKey;
let ncMainNum;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Culling";
const savedKey = ID.MainNurseryCulling.key;
const savedDocNo = ID.MainNurseryCulling.num;

test.describe.serial("Main Nursery Culling API Test", () => {
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

  test("Add new Main Nursery Culling transaction", async ({ api }) => {
    const { status, json } = await apiCall(
      api,
      "POST",
      `${url}/nur/api/NurMainCullPost`,
      {
        data: {
          NCMainKey: 342,
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          NCNum: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          NCReasonKey: -1,
          NCReasonCode: "",
          NCReasonDesc: "",
          NCReasonCodeDesc: "",
          CullDate: currentDate,
          CullQty: createValues[0],
          CullDTQty: createValues[1],
          MSeedling: 7345.0,
          MDTSeedling: 1000.0,
          Remarks: createValues[2],
          Status: "O",
          StatusDesc: "OPEN",
          Stage: "Main Nursery",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T13:46:35.6278291",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-29T05:46:35.6278291Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          Split: false,
          RowState: 1,
        },
      },
      [200, 201]
    );

    if (json) {
      // Call your dynamic setter
      const { key, num } = await setGlobal("mainNursery", json, {
        key: "NCMainKey",
        num: "NCNum",
      });

      ncMainKey = key;
      ncMainNum = num;

      editJson(JsonPath, formName, { key: ncMainKey, num: ncMainNum }, false);
    }
  });

  test("Get Main Nursery Culling transaction by HdrKey", async ({ api }) => {
    const keyToUse = ncMainKey || savedKey;

    await apiCall(
      api,
      "GET",
      `${url}/nur/odata/NurMainCull?HdrKey=${keyToUse}&$format=json`,
      {},
      [200]
    );
  });

  test("Get all Main Nursery Culling transaction", async ({ api }) => {
    await apiCall(
      api,
      "GET",
      `${url}/nur/odata/NurMainCull?$format=json&$orderby=CullDate%20desc,NCMainKey&$select=NCMainKey,NCNum,StatusDesc,OUCode,NurBatchCodeDesc,CullQty,CullDTQty,CullDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(CullDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20CullDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      {},
      [200]
    );
  });

  test("Update Main Nursery Culling transaction", async ({ api }) => {
    const keyToUse = ncMainKey || savedKey;
    const docNoToUse = ncMainNum || savedDocNo;

    await apiCall(
      api,
      "POST",
      `${url}/nur/api/NurMainCullPost`,
      {
        data: {
          NCMainKey: `${keyToUse}`,
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 1,
          NCNum: `${docNoToUse}`,
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          NCReasonKey: 1,
          NCReasonCode: "",
          NCReasonDesc: "",
          NCReasonCodeDesc: "",
          CullDate: currentDate,
          CullQty: editValues[0],
          CullDTQty: editValues[1],
          MSeedling: 7345.0,
          MDTSeedling: 1000.0,
          Remarks: editValues[2],
          Status: "O",
          StatusDesc: "OPEN",
          Stage: "Main Nursery",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T13:46:35.627",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-29T05:46:49.8063752Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          Split: false,
          RowState: 2,
        },
      },
      [200, 204]
    );
  });

  test("Delete Main Nursery Culling transaction", async ({ api }) => {
    const keyToUse = ncMainKey || savedKey;

    await apiCall(
      api,
      "DELETE",
      `${url}/nur/api/NurMainCullPost?key=${keyToUse}`,
      {},
      [204]
    );
  });
});
