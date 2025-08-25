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
} from "@ApiFolder/apiUtils/apiHelpers.js";
import editJson from "@utils/commonFunctions/EditJson";

let dbtKey;
let dbtNum;
let connectExcel;
let createValues;
let editValues;
const currentDate = new Date().toISOString();

const url = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Germinated";
const savedKey = ID.PreNurseryGerminated.key;
const savedDocNo = ID.PreNurseryGerminated.num;

test.beforeAll(async () => {
  // Initialize Excel connection with the selected file
  connectExcel = new ConnectExcel(sheetName, formName);
  await connectExcel.init(false);

  // Read Excel data once
  createValues = (await connectExcel.readExcel("CreateAPIData", false)).split(
    ";"
  );
  editValues = (await connectExcel.readExcel("EditAPIData", false)).split(";");
});

test("@api Add new Pre Nursery Germinated transaction", async ({
  request,
  authToken,
}) => {
  const response = await request.post(`${url}/nur/api/NurPDbtPost`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
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
  });

  const { status, json } = await handleApiResponse(response);

  expect([200, 201]).toContain(status);
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

test("@api Get Pre Nursery Germinated transaction by HdrKey", async ({
  request,
  authToken,
}) => {
  const response = await request.get(
    `${url}/nur/odata/NurPDbt?HdrKey=${savedKey}&$format=json`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    }
  );
  console.log(await response.json());
  expect(response.status()).toBe(200);
});

test("@api Get all Pre Nursery Germinated transaction", async ({
  request,
  authToken,
}) => {
  const response = await request.get(
    `${url}/nur/odata/NurPDbt?$format=json&$orderby=DbtDate%20desc,DbtKey&$select=DbtKey,StatusDesc,OUCode,NurBatchCodeDesc,PlantMateDesc,SgtQty,DbtQty,Remarks,DbtDate,PDoubletonNum,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(DbtDate%20ge%20datetime%272025-08-01T00%3A00%3A00%27%20and%20DbtDate%20le%20datetime%272025-08-31T00%3A00%3A00%27))`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    }
  );
  console.log(await response.json());
  expect(response.status()).toBe(200);
});

test("@api Update Pre Nursery Germinated transaction", async ({
  request,
  authToken,
}) => {
  const response = await request.post(`${url}/nur/api/NurPDbtPost`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      DbtKey: `${savedKey}`,
      PDoubletonNum: `${savedDocNo}`,
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
  });

  console.log(
    response.status() === 204
      ? "Update successful (no content returned)"
      : await response.json()
  );

  expect([200, 204]).toContain(response.status());
});

test("@api Delete Pre Nursery Germinated transaction", async ({
  request,
  authToken,
}) => {
  const response = await request.delete(
    `${url}/nur/api/nurPDbtPost?key=${savedKey}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    }
  );

  console.log(
    response.status() === 204
      ? "Delete successful (no content returned)"
      : await response.json()
  );

  expect([200, 204]).toContain(response.status());
});
