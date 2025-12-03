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
let runDistHdrKey, runDistNum, ouKey, vehKey, gridKey;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const vehUrl = VEH_API_URL;
const sheetName = "VEHAPI_Data";
const formName = "Vehicle Running Distribution";
const basePayloads = VehiclePayloads.VehicleRunningDistribution;
const savedKey = ID.VehicleRunningDistribution.key;
const savedDocNo = ID.VehicleRunningDistribution.num;
const savedOUKey = ID.VehicleRunningDistribution.ou;
const savedVehKey = ID.VehicleRunningDistribution.vehId;
const savedGridKey = ID.VehicleRunningDistribution.gridId;

test.describe.serial("Vehicle Running Distribution API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );
    apiObj = new ApiCallBase(null, "", formName, VehicleJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test.describe("CRUD Operation Testing", () => {
    test("Add new Vehicle Running Distribution transaction", async ({
      api,
    }) => {
      apiObj.setUrl(`${vehUrl}/api/RunDist`);

      const { key, num, ou, vehId, status, json } = await apiObj.create(
        {
          ...basePayloads,
          RunDistDate: currentDate,
          Remarks: createValues[0],
          VehKey: createValues[1],
          pRunDistDetails: [
            {
              ActExpAccKey: createValues[2],
              CCIDKey: createValues[3],
              Day01: createValues[4],
              Day02: createValues[5],
              Day03: createValues[6],
              Day04: createValues[7],
              Day05: createValues[8],
              Remarks: createValues[9],
              RowState: 1,
            },
          ],
        },
        {
          key: "RunDistHdrKey",
          num: "RunDistNum",
          ou: "OUKey",
          vehId: "VehKey",
        }
      );
      expect(status).toBe[(200, 201)]; // or [200, 201]

      runDistHdrKey = key;
      runDistNum = num;
      ouKey = ou;
      vehKey = vehId;
    });

    test("Get Vehicle Running Distribution by HdrKey", async ({ api }) => {
      const keyToUse = runDistHdrKey || savedKey;

      apiObj.setUrl(`${vehUrl}/odata/RunDistHeader?RunDistHdrKey=${keyToUse}`);
      await apiObj.getByKey();
    });

    test("Get Vehicle Running Distribution details by HdrKey", async ({
      api,
    }) => {
      const keyToUse = runDistHdrKey || savedKey;
      const ouToUse = ouKey || savedOUKey;

      apiObj.setUrl(
        `${vehUrl}/odata/PRunDistDetail?&$filter=RunDistHdrKey+eq+${keyToUse}&&OUKey+eq+${ouToUse}&%24inlinecount=allpages`
      );

      await apiObj.getByKey();
    });

    test("Get Vehicle Running Distribution details & summary by HdrKey", async ({
      api,
    }) => {
      const keyToUse = runDistHdrKey || savedKey;
      const ouToUse = ouKey || savedOUKey;

      apiObj.setUrl(
        `${vehUrl}/odata/PRunDistDetail?Summary=true&RunDistHdrKey=${keyToUse}&&OUKey+eq+${ouToUse}&$expand=PSumRunDistDetail&%24inlinecount=allpages`
      );
      await apiObj.getByKey();
    });

    // test("Get all Pre Nursery Seed Received transaction", async ({ api }) => {
    //   const ouToUse = ouKey || savedOUKey;
    //   const vehToUse = vehKey || savedVehKey;

    //   apiObj.setUrl(
    //     `${vehUrl}/odata/RunDistHeader?Date=29%2F09%2F2025&OUKey=${ouToUse}&VehKey=${vehToUse}`
    //   );
    //   await apiObj.getAll();
    // });

    test("Update Vehicle Running Distribution transaction", async ({ api }) => {
      const keyToUse = runDistHdrKey || savedKey;
      const docNoToUse = runDistNum || savedDocNo;
      const vehToUse = vehKey || savedVehKey;

      apiObj.setUrl(`${vehUrl}/api/RunDist`);

      const { status, json } = await apiObj.update("POST", {
        ...basePayloads,
        RunDistHdrKey: keyToUse,
        RunDistNum: docNoToUse,
        RunDistDate: currentDate,
        Remarks: editValues[0],
        VehKey: vehToUse,
        RowState: 2,
        pRunDistDetails: [
          {
            PRunDistDetKey: -1,
            RunDistHdrKey: keyToUse,
            ActExpAccKey: editValues[1],
            CCIDKey: editValues[2],
            Day01: editValues[3],
            Day02: editValues[4],
            Day03: editValues[5],
            Day04: editValues[6],
            Day05: editValues[7],
            Remarks: editValues[8],
            RowState: 2,
          },
        ],
      });
      expect(status).toBe[(200, 201)]; // or [200, 201]
    });

    test("Delete Vehicle Running Distribution transaction", async ({ api }) => {
      const keyToUse = runDistHdrKey || savedKey;
      apiObj.setUrl(`${vehUrl}api/RunDist?key=${keyToUse}`);

      await apiObj.delete();
    });
  });
});
