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

let prcvKey;
let prcvNum;
let connectExcel;
let createValues;
let editValues;
const currentDate = new Date().toISOString();

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Seed Received";
const savedKey = ID.PreNurserySeedReceived.key;
const savedDocNo = ID.PreNurserySeedReceived.num;

test.describe.serial("Pre Nursery Seed Received API Test", () => {
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

  test("Add new Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const { status, json } = await apiCall(
      request,
      "POST", // <-- method
      `${url}/nur/api/NurPRcvPost`, // <-- URL
      authToken,
      {
        data: {
          PRcvKey: 59,
          PRcvNum: "",
          RcvDate: currentDate,
          RefNo: createValues[0],
          PlantSourceKey: 3,
          PlantSourceCode: "",
          PlantSourceDesc: "",
          PlantSourceCodeDesc: "",
          RcvQty: 12.0,
          Remarks: createValues[1],
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "",
          Status: "O",
          StatusDesc: "OPEN",
          OrdQty: createValues[2],
          DelQty: createValues[3],
          DamQty: createValues[4],
          FocQty: createValues[5],
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          PInterOUTrnKey: 0,
          IsTransferFromInterPre: false,
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-20T13:20:39.2148344",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-20T05:20:39.2148344Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 1,
        },
      },
      [200, 201] // <-- expected status codes
    );

    if (json) {
      // Call your dynamic setter
      const { key, num } = await setGlobal("preNursery", json, {
        key: "PRcvKey",
        num: "PRcvNum",
      });

      prcvKey = key;
      prcvNum = num;

      editJson(JsonPath, formName, { key: prcvKey, num: prcvNum }, false);
    }
  });

  test("Get Pre Nursery Seed Received by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = prcvKey || savedKey;
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPRcv?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurPRcv?$format=json&$orderby=RcvDate%20desc,PRcvKey&$select=PRcvKey,RefNo,PlantSourceDesc,StatusDesc,OUCode,NurBatchCodeDesc,OrdQty,DelQty,DamQty,RcvQty,FocQty,Remarks,RcvDate,PRcvNum,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(RcvDate%20ge%20datetime%272025-08-01T00%3A00%3A00%27%20and%20RcvDate%20le%20datetime%272025-08-31T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = prcvKey || savedKey;
    const docNoToUse = prcvNum || savedDocNo;

    await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurPRcvPost`,
      authToken,
      {
        data: {
          PRcvKey: `${keyToUse}`,
          PRcvNum: `${docNoToUse}`,
          RcvDate: currentDate,
          RefNo: editValues[0],
          PlantSourceKey: 3,
          PlantSourceCode: "",
          PlantSourceDesc: "",
          PlantSourceCodeDesc: "",
          RcvQty: 12.0,
          Remarks: editValues[1],
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "",
          Status: "O",
          StatusDesc: "OPEN",
          OrdQty: editValues[2],
          DelQty: editValues[3],
          DamQty: editValues[4],
          FocQty: editValues[5],
          ClientKey: 0,
          OUKey: 16,
          OUCode: "",
          OUDesc: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          PInterOUTrnKey: 0,
          IsTransferFromInterPre: false,
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-20T13:20:39.2148344",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-20T05:20:39.2148344Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 2,
        },
      },
      [200, 204]
    );
  });

  test("Delete Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = prcvKey || savedKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/nurPRcvPost?key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
