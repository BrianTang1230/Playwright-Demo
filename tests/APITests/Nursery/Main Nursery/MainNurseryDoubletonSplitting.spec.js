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

test.describe.serial("Main Nursery Doubleton Splitting API Test", () => {
  let mdbtSplitKey;
  let mdbtSplitNum;
  let connectExcel;
  let createValues;
  let editValues;
  const currentDate = new Date().toISOString().split("T")[0];

  const url = NUR_API_URL;
  const sheetName = "NURAPI_Data";
  const formName = "Main Nursery Doubleton Splitting";
  const savedKey = ID.MainNurseryDoubletonSplitting.key;
  const savedDocNo = ID.MainNurseryDoubletonSplitting.num;

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

  test("Add new Main Nursery Doubleton Splitting transaction", async ({
    request,
    authToken,
  }) => {
    const { json, status } = await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurDbtSplitPost`,
      authToken,
      {
        data: {
          MDbtSplitKey: 37,
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          MDbtSplitNum: "",
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          MDbtSplitDate: currentDate,
          SplitQty: createValues[0],
          AvlbQty: 0.0,
          MSeedling: 0.0,
          Remarks: createValues[1],
          Status: "O",
          StatusDesc: "OPEN",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T13:21:53.4537023",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-29T05:21:53.4537023Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          RowState: 1,
        },
      },
      [200, 201]
    );

    if (json) {
      // Call your dynamic setter
      const { key, num } = await setGlobal("mainNursery", json, {
        key: "MDbtSplitKey",
        num: "MDbtSplitNum",
      });

      mdbtSplitKey = key;
      mdbtSplitNum = num;

      editJson(
        JsonPath,
        formName,
        { key: mdbtSplitKey, num: mdbtSplitNum },
        false
      );
    }
  });

  test("Get Main Nursery Doubleton Splitting transaction by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mdbtSplitKey || savedKey;

    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurDbtSplit?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Main Nursery Doubleton Splitting transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurDbtSplit?$format=json&$orderby=MDbtSplitDate%20desc,MDbtSplitKey&$select=MDbtSplitKey,MDbtSplitNum,StatusDesc,OUCode,NurBatchCodeDesc,SplitQty,MDbtSplitDate,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(MDbtSplitDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20MDbtSplitDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Main Nursery Doubleton Splitting transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mdbtSplitKey || savedKey;
    const docNoToUse = mdbtSplitNum || savedDocNo;

    await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurDbtSplitPost`,
      authToken,
      {
        data: {
          MDbtSplitKey: `${keyToUse}`,
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 1,
          MDbtSplitNum: `${docNoToUse}`,
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          MDbtSplitDate: currentDate,
          SplitQty: editValues[0],
          AvlbQty: 1000.0,
          MSeedling: 0.0,
          Remarks: editValues[1],
          Status: "O",
          StatusDesc: "OPEN",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T13:21:53.453",
          UpdatedBy: 6,
          UpdatedDate: "2025-08-29T05:22:08.3631502Z",
          UpdatedByCode: "LMSUPPORT",
          UpdatedByDesc: "lmsupport",
          RowState: 2,
        },
      },
      [200, 204]
    );
  });

  test("Delete Main Nursery Doubleton Splitting transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mdbtSplitKey || savedKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/NurDbtSplitPost?key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
