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

let mSoldKey;
let mSoldNum;
let connectExcel;
let createValues;
let editValues;
const currentDate = new Date().toISOString().split("T")[0];

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Main Nursery Sold";
const savedKey = ID.MainNurserySold.key;
const savedDocNo = ID.MainNurserySold.num;

test.describe.serial("Main Nursery Sold", () => {
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

  test("Add new Main Nursery Sold transaction", async ({
    request,
    authToken,
  }) => {
    const { json, status } = await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurMainSoldPost`,
      authToken,
      {
        data: {
          MSoldKey: 253,
          SoldDate: currentDate,
          MSoldNum: "",
          SoldQty: createValues[0],
          Remarks: createValues[1],
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "PA001 - PA BATCH 1",
          Status: "O",
          StatusDesc: "OPEN",
          SoldToAccKey: createValues[2],
          SoldToAccNum: "",
          SoldToAccNumAccDesc: "",
          ClientKey: 0,
          OUKey: 16,
          OUDesc: "",
          OUCode: "",
          OUCodeOUDesc: "",
          CompKey: 0,
          CCIDKey: createValues[3],
          ContactKey: createValues[4],
          CCIDCode: "",
          CCIDCodeCCIDDesc: "",
          BuyerCodeDesc: "",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T14:48:39.551897",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-29T06:48:39.551897Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 1,
          IsApplied: false,
          IsAppliedRequisition: false,
          SoldDetKey: -1,
        },
      },
      [200, 201]
    );

    if (json) {
      // Call your dynamic setter
      const { key, num } = await setGlobal("mainNursery", json, {
        key: "MSoldKey",
        num: "MSoldNum",
      });

      mSoldKey = key;
      mSoldNum = num;

      editJson(JsonPath, formName, { key: mSoldKey, num: mSoldNum }, false);
    }
  });

  test("Get Main Nursery Sold transaction by HdrKey", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mSoldKey || savedKey;

    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurMainSold?HdrKey=${keyToUse}&$format=json`,
      authToken,
      {},
      [200]
    );
  });

  test("Get all Main Nursery Sold transaction", async ({
    request,
    authToken,
  }) => {
    await apiCall(
      request,
      "GET",
      `${url}/nur/odata/NurMainSold?$format=json&$orderby=SoldDate%20desc,MSoldKey&$select=MSoldKey,StatusDesc,OUCode,NurBatchCodeDesc,SoldToAccNum,SoldToAccNumAccDesc,CCIDCodeCCIDDesc,SoldQty,Remarks,SoldDate,MSoldNum,BuyerCodeDesc,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(SoldDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20SoldDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`,
      authToken,
      {},
      [200]
    );
  });

  test("Update Main Nursery Sold transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mSoldKey || savedKey;
    const docNoToUse = mSoldNum || savedDocNo;

    await apiCall(
      request,
      "POST",
      `${url}/nur/api/NurMainSoldPost`,
      authToken,
      {
        data: {
          MSoldKey: `${keyToUse}`,
          SoldDate: currentDate,
          MSoldNum: `${docNoToUse}`,
          SoldQty: editValues[0],
          Remarks: editValues[1],
          NurBatchKey: 138,
          NurBatchCode: "",
          NurBatchDesc: "",
          NurBatchCodeDesc: "",
          Status: "O",
          StatusDesc: "OPEN",
          SoldToAccKey: editValues[2],
          SoldToAccNum: "",
          SoldToAccNumAccDesc: "",
          ClientKey: 1,
          OUKey: 16,
          OUDesc: "",
          OUCode: "",
          OUCodeOUDesc: "",
          CompKey: 1,
          CCIDKey: editValues[3],
          ContactKey: editValues[4],
          CCIDCode: "",
          CCIDCodeCCIDDesc: "",
          BuyerCodeDesc: "",
          CreatedBy: 6,
          CreatedByCode: "LMSUPPORT",
          CreatedByDesc: "lmsupport",
          CreatedDate: "2025-08-29T14:48:39.553",
          LastUpdatedBy: 6,
          LastUpdatedDate: "2025-08-29T06:49:04.7320063Z",
          LastUpdatedByCode: "LMSUPPORT",
          LastUpdatedByDesc: "lmsupport",
          RowState: 2,
          IsApplied: false,
          IsAppliedRequisition: false,
          SoldDetKey: -1,
        },
      },
      [200, 204]
    );
  });

  test("Delete Main Nursery Sold transaction", async ({
    request,
    authToken,
  }) => {
    const keyToUse = mSoldKey || savedKey;

    await apiCall(
      request,
      "DELETE",
      `${url}/nur/api/NurMainSoldPost?key=${keyToUse}`,
      authToken,
      {},
      [204]
    );
  });
});
