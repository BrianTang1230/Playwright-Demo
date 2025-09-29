import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import {
  VehicleJsonPath,
  VEH_API_URL,
  ID,
  VehiclePayloads,
} from "@utils/data/apidata/vehicleApiData.json";
import { create } from "domain";

let apiObj;
let prcvKey, prcvNum;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const vehUrl = VEH_API_URL;
const sheetName = "NURAPI_Data";
const formName = "Pre Nursery Seed Received";
const basePayloads = VehiclePayloads.VehicleRunningDistribution;
// const savedKey = ID.VehicleRunningDistribution.key;
// const savedDocNo = ID.VehicleRunningDistribution.num;

test.describe.serial("Pre Nursery Seed Received API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );
    apiObj = new ApiCallBase(null, "", formName, NurseryJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test.describe("CRUD Operation Testing", () => {
    test("Add new Pre Nursery Seed Received transaction", async ({ api }) => {
      apiObj.setUrl(`${nurUrl}/nur/api/NurPRcvPost`);

      const { key, num, status, json } = await apiObj.create(
        {
          ...basePayloads,
          RunDistDate: currentDate,
          Remarks: createValues[0],
        },
        {
          key: "PRcvKey",
          num: "PRcvNum",
        }
      );
      expect(status).toBe[(200, 201)]; // or [200, 201]

      prcvKey = key;
      prcvNum = num;
    });

    test("Get Pre Nursery Seed Received by HdrKey", async ({ api }) => {
      const keyToUse = prcvKey || savedKey;
      apiObj.setUrl(
        `${nurUrl}/nur/odata/NurPRcv?HdrKey=${keyToUse}&$format=json`
      );
      await apiObj.getByKey();
    });

    test("Get all Pre Nursery Seed Received transaction", async ({ api }) => {
      apiObj.setUrl(
        `${nurUrl}/nur/odata/NurPRcv?$format=json&$orderby=RcvDate%20desc,PRcvKey&$select=PRcvKey,RefNo,PlantSourceDesc,StatusDesc,OUCode,NurBatchCodeDesc,OrdQty,DelQty,DamQty,RcvQty,FocQty,Remarks,RcvDate,PRcvNum,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(RcvDate%20ge%20datetime%27${currentDate}T00%3A00%3A00%27%20and%20RcvDate%20le%20datetime%27${currentDate}T00%3A00%3A00%27))`
      );
      await apiObj.getAll();
    });

    test("Update Pre Nursery Seed Received transaction", async ({ api }) => {
      const keyToUse = prcvKey || savedKey;
      const docNoToUse = prcvNum || savedDocNo;

      apiObj.setUrl(`${nurUrl}/nur/api/NurPRcvPost`);

      const { status, json } = await apiObj.update("POST", {
        ...basePayloads,
        PRcvKey: keyToUse,
        PRcvNum: docNoToUse,
        RcvDate: currentDate,
        RefNo: editValues[0],
        Remarks: editValues[1],
        OrdQty: editValues[2],
        DelQty: editValues[3],
        DamQty: editValues[4],
        FocQty: editValues[5],
        RowState: 2,
      });
    });

    test("Delete Pre Nursery Seed Received transaction", async ({ api }) => {
      const keyToUse = prcvKey || savedKey;
      apiObj.setUrl(`${nurUrl}/nur/api/nurPRcvPost?key=${keyToUse}`);

      await apiObj.delete();
    });
  });
});
