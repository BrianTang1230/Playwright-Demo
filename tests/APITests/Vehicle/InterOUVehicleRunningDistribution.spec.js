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

let apiObj;
let intRunDistHdrKey, iRunDistNum, ouKey, vehKey;
let createValues, editValues;
const currentDate = new Date().toISOString().split("T")[0];

const vehUrl = VEH_API_URL;
const sheetName = "VEHAPI_Data";
const formName = "Inter OU Vehicle Running Distribution (Loan To)";
const basePayloads = VehiclePayloads.InterOUVehicleRunningDistributionLoanTo;
const savedKey = ID.InterOUVehicleRunningDistributionLoanTo.key;
const savedDocNo = ID.InterOUVehicleRunningDistributionLoanTo.num;
const savedOUKey = ID.InterOUVehicleRunningDistributionLoanTo.ou;
const savedVehKey = ID.InterOUVehicleRunningDistributionLoanTo.vehId;
// const savedGridKey = ID.InterOUVehicleRunningDistributionLoanTo.gridId;

test.describe
  .serial("Inter-OU Vehicle Running Distribution (Loan To) API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // force API mode
    // Read Excel data once
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );
    apiObj = new ApiCallBase(
      null,
      "",
      "InterOUVehicleRunningDistributionLoanTo",
      VehicleJsonPath
    );
  });

  test.beforeEach(async ({ api }) => {
    // rebind fresh api context before every test
    apiObj.api = api;
  });

  test.describe("CRUD Operation Testing", () => {
    test("Add new Inter-OU Vehicle Running Distribution (Loan To) transaction", async ({
      api,
    }) => {
      apiObj.setUrl(`${vehUrl}/api/IntRunDist`);

      const { key, num, ou, vehId, status, json } = await apiObj.create(
        {
          ...basePayloads,
        },
        {
          key: "IntRunDistHdrKey",
          num: "IRunDistNum",
          ou: "OUKey",
          vehId: "VehKey",
        }
      );

      intRunDistHdrKey = key;
      iRunDistNum = num;
      ouKey = ou;
      vehKey = vehId;
    });

    //   test("Get Inter-OU Vehicle Running Distribution (Loan To) by HdrKey", async ({
    //     api,
    //   }) => {
    //     const keyToUse = runDistHdrKey || savedKey;

    //     apiObj.setUrl(`${vehUrl}/odata/RunDistHeader?RunDistHdrKey=${keyToUse}`);
    //     await apiObj.getByKey();
    //   });

    //   test("Get Inter-OU Vehicle Running Distribution (Loan To) details by HdrKey", async ({
    //     api,
    //   }) => {
    //     const keyToUse = runDistHdrKey || savedKey;
    //     const ouToUse = ouKey || savedOUKey;

    //     apiObj.setUrl(
    //       `${vehUrl}/odata/PRunDistDetail?&$filter=RunDistHdrKey+eq+${keyToUse}&&OUKey+eq+${ouToUse}&%24inlinecount=allpages`
    //     );

    //     const { gridId, status, json } = await apiObj.getByKey(true, {
    //       gridId: "PRunDistDetKey",
    //     });

    //     gridKey = gridId;
    //   });

    //   test("Update Inter-OU Vehicle Running Distribution (Loan To) transaction", async ({
    //     api,
    //   }) => {
    //     const keyToUse = runDistHdrKey || savedKey;
    //     const docNoToUse = runDistNum || savedDocNo;
    //     const vehToUse = vehKey || savedVehKey;
    //     const gridToUse = gridKey || savedGridKey;

    //     apiObj.setUrl(`${vehUrl}/api/RunDist`);

    //     const { status, json } = await apiObj.update("POST", {
    //       ...basePayloads,
    //       RunDistHdrKey: keyToUse,
    //       RunDistNum: docNoToUse,
    //       RunDistDate: currentDate,
    //       Remarks: editValues[0],
    //       VehKey: vehToUse,
    //       RowState: 2,
    //       pRunDistDetails: [
    //         {
    //           PRunDistDetKey: gridToUse,
    //           RunDistHdrKey: keyToUse,
    //           ActExpAccKey: editValues[1],
    //           CCIDKey: editValues[2],
    //           Day01: editValues[3],
    //           Day02: editValues[4],
    //           Day03: editValues[5],
    //           Day04: editValues[6],
    //           Day05: editValues[7],
    //           Remarks: editValues[8],
    //           RowState: 2,
    //         },
    //       ],
    //     });
    //     expect(status).toBe[(200, 201)]; // or [200, 201]
    //   });

    //   test("Delete Inter-OU Vehicle Running Distribution (Loan To) transaction", async ({
    //     api,
    //   }) => {
    //     const keyToUse = runDistHdrKey || savedKey;

    //     apiObj.setUrl(`${vehUrl}/api/RunDist?key=${keyToUse}`);

    //     await apiObj.delete();
    //   });
  });
});
