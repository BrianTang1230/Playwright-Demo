import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import NurseryApi from "@ApiFolder/pages/Nursery/NurseryPages.js";
import {
  NurseryJsonPath,
  NUR_API_URL,
  ID,
  NurseryPayloads,
} from "@utils/data/apidata/nurseryApiData.json";

let apiObj;
let dbtKey, dbtNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const nurUrl = NUR_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Germinated";
const basePayloads = NurseryPayloads.PreNurseryGerminated;
const savedKey = ID.PreNurseryGerminated.key;
const savedDocNo = ID.PreNurseryGerminated.num;

test.describe.serial("Pre Nursery Germinated", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );
    apiObj = new NurseryApi(null, "", formName, NurseryJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test("Add new Pre Nursery Germinated transaction", async ({ api }) => {
    apiObj.setUrl(`${nurUrl}/nur/api/NurPDbtPost`);

    const { key, num, status, json } = await apiObj.create(
      {
        ...basePayloads,
        DbtDate: currentDate,
        DbtQty: createValues[0],
        Remarks: createValues[1],
        SgtQty: createValues[2],
      },
      {
        key: "DbtKey",
        num: "PDoubletonNum",
      }
    );

    dbtKey = key;
    dbtNum = num;
  });

  test("Get Pre Nursery Germinated transaction by HdrKey", async ({ api }) => {
    const keyToUse = dbtKey || savedKey;
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPDbt?HdrKey=${keyToUse}&$format=json`
    );
    await apiObj.getByKey();
  });

  test("Get all Pre Nursery Germinated transaction", async ({ api }) => {
    apiObj.setUrl(
      `${nurUrl}/nur/odata/NurPDbt?$format=json&$orderby=DbtDate%20desc,DbtKey&$select=DbtKey,StatusDesc,OUCode,NurBatchCodeDesc,PlantMateDesc,SgtQty,DbtQty,Remarks,DbtDate,PDoubletonNum,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(DbtDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20DbtDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
    );
    await apiObj.getAll();
  });

  test("Update Pre Nursery Germinated transaction", async ({ api }) => {
    const keyToUse = dbtKey || savedKey;
    const docNoToUse = dbtNum || savedDocNo;

    apiObj.setUrl(`${nurUrl}/nur/api/NurPDbtPost`);

    const { status, json } = await apiObj.update("POST", {
      ...basePayloads,
      DbtKey: keyToUse,
      PDoubletonNum: docNoToUse,
      DbtDate: currentDate,
      DbtQty: editValues[0],
      Remarks: editValues[1],
      SgtQty: editValues[2],
      RowState: 2,
    });
  });

  test("Delete Pre Nursery Germinated transaction", async ({ api }) => {
    const keyToUse = dbtKey || savedKey;

    apiObj.setUrl(`${nurUrl}/nur/api/nurPDbtPost?key=${keyToUse}`);

    await apiObj.delete();
  });
});
