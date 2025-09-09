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

let dbtKey;
let dbtNum;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Germinated";
const savedKey = ID.PreNurseryGerminated.key;
const savedDocNo = ID.PreNurseryGerminated.num;

test.describe.serial("Pre Nursery Germinated", () => {
  test.beforeAll(async () => {
    // Initialize Excel connection with the selected file
    connectExcel = new ConnectExcel(sheetName, formName);
    await connectExcel.init(false);

    // Read Excel data once
    createValues = (
      await excel.readExcel(sheetName, formName, "CreateAPIData", false)
    ).split(";");
    editValues = (
      await excel.readExcel(sheetName, formName, "EditAPIData", false)
    ).split(";");
  });

  test("Add new Pre Nursery Germinated transaction", async ({
    request,
    authToken,
  }) => {
    const { json, status } = await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurPDbtPost`,
      authToken,
      {
        data: {
          DbtKey: 45,
          PDoubletonNum: "",
          DbtDate: currentDate,
          PlantMateKey: 37,
          PlantMateCode: "",
          PlantMateDesc: "",
          PlantMateCodeDesc: "",
          DbtQty: createValues[0],
          Remarks: createValues[1],
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          Status: "O",
          StatusDesc: "OPEN",
          SgtQty: createValues[2],
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-21T16:22:57.4103475",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-21T08:22:57.4103475Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          PInterOUTrnKey: -1,
          IsTransferFromInterPre: false,
          RowState: 1,
        },
      },
      [200, 201]
    );

    if (json) {
      // Call your dynamic setter
      const { key, num } = await setGlobal("preNursery", json, {
        key: "DbtKey",
        num: "PDoubletonNum",
      });

      dbtKey = key;
      dbtNum = num;

      editJson(JsonPath, formName, { key: dbtKey, num: dbtNum }, false);
    }
  });

  test("Get Pre Nursery Germinated transaction by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = dbtKey || savedKey;

    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPDbt?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Pre Nursery Germinated transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPDbt?$format=json&$orderby=DbtDate%20desc,DbtKey&$select=DbtKey,StatusDesc,OUCode,NurBatchCodeDesc,PlantMateDesc,SgtQty,DbtQty,Remarks,DbtDate,PDoubletonNum,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(DbtDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20DbtDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Pre Nursery Germinated transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = dbtKey || savedKey;
    const docNoToUse = dbtNum || savedDocNo;

    await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurPDbtPost`,
      authToken,
      {
        data: {
          DbtKey: `${keyToUse}`,
          PDoubletonNum: `${docNoToUse}`,
          DbtDate: currentDate,
          PlantMateKey: 37,
          PlantMateCode: "",
          PlantMateDesc: "",
          PlantMateCodeDesc: "",
          DbtQty: createValues[0],
          Remarks: createValues[1],
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          Status: "O",
          StatusDesc: "OPEN",
          SgtQty: createValues[2],
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-21T16:22:57.4103475",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-21T08:22:57.4103475Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          PInterOUTrnKey: -1,
          IsTransferFromInterPre: false,
          RowState: 2,
        },
      },
      [200, 204]
    );
  });

  test("Delete Pre Nursery Germinated transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = dbtKey || savedKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/nurPDbtPost?key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
