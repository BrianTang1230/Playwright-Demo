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

let pdbtSplitKey;
let pdbtSplitNum;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Doubleton Splitting";
const savedKey = ID.PreNurseryDoubletonSplitting.key;
const savedDocNo = ID.PreNurseryDoubletonSplitting.num;

test.describe.serial("Pre Nursery Doubleton Splitting API Test", () => {
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

  test("Add new Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const { json, status } = await apiCall(
      api,
      "POST",
      `${url}/nur/api/NurPDbtSplitPost`,
      {
        data: {
          PDbtSplitKey: 1,
          ClientKey: -1,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: -1,
          PDbtSplitNum: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          PDbtSplitDate: currentDate,
          SplitQty: createValues[0],
          AvlbQty: 0.0, // Get from Pre-Nursery Germinated
          PSeedling: 0.0,
          Remarks: createValues[1],
          Status: "O",
          StatusDesc: "OPEN",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-22T14:54:30.7401024",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-22T06:54:30.7401024Z",
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
        key: "PDbtSplitKey",
        num: "PDbtSplitNum",
      });

      pdbtSplitKey = key;
      pdbtSplitNum = num;

      editJson(
        JsonPath,
        formName,
        { key: pdbtSplitKey, num: pdbtSplitNum },
        false
      );
    }
  });

  test("Get Pre Nursery Doubleton Splitting transaction by HdrKey", async ({
    api,
  }) => {
    const keyToUse = pdbtSplitKey || savedKey;

    await apiCall(
      api,
      "GET",
      `${url}/nur/odata/NurPDbtSplit?HdrKey=${keyToUse}&$format=json`,
      {},
      [200]
    );
  });

  test("Get all Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    await apiCall(
      api,
      "GET",
      `${url}/nur/odata/NurPDbtSplit?$format=json&$orderby=PDbtSplitDate%20desc,PDbtSplitKey&$select=PDbtSplitKey,PDbtSplitNum,StatusDesc,OUCode,NurBatchCodeDesc,SplitQty,PDbtSplitDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(PDbtSplitDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20PDbtSplitDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      {},
      [200]
    );
  });

  test("Update Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const keyToUse = pdbtSplitKey || savedKey;
    const docNoToUse = pdbtSplitNum || savedDocNo;

    await apiCall(
      api,
      "POST",
      `${url}/nur/api/NurPDbtSplitPost`,
      {
        data: {
          PDbtSplitKey: `${keyToUse}`,
          ClientKey: -1,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: -1,
          PDbtSplitNum: `${docNoToUse}`,
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          PDbtSplitDate: currentDate,
          SplitQty: editValues[0],
          AvlbQty: 0.0, // Get from Pre-Nursery Germinated
          PSeedling: 0.0,
          Remarks: editValues[1],
          Status: "O",
          StatusDesc: "OPEN",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-22T14:54:30.7401024",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-22T06:54:30.7401024Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          RowState: 2,
        },
      },
      [200, 204]
    );
  });

  test("Delete Pre Nursery Doubleton Splitting transaction", async ({
    api,
  }) => {
    const keyToUse = pdbtSplitKey || savedKey;

    await apiCall(
      api,
      "DELETE",
      `${url}/nur/api/NurPDbtSplitPost?key=${keyToUse}`,
      {},
      [204]
    );
  });
});
