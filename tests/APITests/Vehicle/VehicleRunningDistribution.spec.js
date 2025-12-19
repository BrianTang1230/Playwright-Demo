/**
 * VEHICLE RUNNING DISTRIBUTION API AUTOMATION TEST
 * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle.
 * Data Source: Excel Sheet 'VEHAPI_Data', Form 'Vehicle Running Distribution'
 */

import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import {
  VehicleJsonPath,
  VEH_API_URL,
  ID,
  VehiclePayloads,
} from "@utils/data/apidata/vehicleApiData.json";

// Global variables to maintain state
let apiObj, createValues, editValues;
let runDistHdrKey, runDistNum, ouKey, vehKey;
let createdRecord;

const vehUrl = VEH_API_URL;
const sheetName = "VEHAPI_Data";
const formName = "Vehicle Running Distribution";
const basePayloads = VehiclePayloads.VehicleRunningDistribution;

// Fallback keys if test is run individually without create
const savedKey = ID.VehicleRunningDistribution.key;
const savedDocNo = ID.VehicleRunningDistribution.num;
const savedOUKey = ID.VehicleRunningDistribution.ou;
const savedVehKey = ID.VehicleRunningDistribution.vehId;

test.describe.serial("Vehicle Running Distribution API Test", () => {
    
    // --- SETUP ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // Force API mode
        [createValues, editValues] = await excel.loadExcelValues(
            sheetName,
            formName,
            { isUI: false }
        );
        apiObj = new ApiCallBase(null, "", formName, VehicleJsonPath);
    });

    test.beforeEach(async ({ api }) => {
        apiObj.api = api;
    });

    test.describe("CRUD Operation Testing", () => {

        // --- STEP 1: CREATE (POST) ---
        test("Add new Vehicle Running Distribution transaction", async ({ api }) => {
            apiObj.setUrl(`${vehUrl}/api/RunDist`);
            
            const currentDate = new Date().toISOString().split("T")[0];

            // Build Payload
            const payloadToSend = {
                ...basePayloads,
                Remarks: createValues[0],
                OUKey: createValues[1],
                CreatedDate: currentDate,
                LastUpdatedDate: currentDate,
                RowState: 1,
                PriOUMKey: createValues[2],
                PriUOMDesc: createValues[3],
                RegNo: createValues[4],

                // Map Details
                pRunDistDetails: [
                    {
                        ...basePayloads.pRunDistDetails?.[0],
                        OUKey: createValues[5],
                        ActExpAccKey: createValues[6],
                        ActExpAccNum: createValues[7],
                        ActExpAccDesc: createValues[8],
                        CCIDKey: createValues[9],
                        CCIDCodeCCIDDesc: createValues[10],
                        Total: createValues[11],
                        Day01: createValues[12],
                        Day02: createValues[13],
                        Day03: createValues[14],
                        Day04: createValues[15],
                        Day05: createValues[16],
                        Day06: createValues[17],
                        Day07: createValues[18],
                        Day08: createValues[19],
                        Day09: createValues[20],
                        Day10: createValues[21],
                        Day11: createValues[22],
                        Day12: createValues[23],
                        Day13: createValues[24],
                        Day14: createValues[25],
                        Day15: createValues[26],
                        Day16: createValues[27],
                        Day17: createValues[28],
                        Day18: createValues[29],
                        Day19: createValues[30],
                        Day20: createValues[31],
                        Day21: createValues[32],
                        Day22: createValues[33],
                        Day23: createValues[34],
                        Day24: createValues[35],
                        Day25: createValues[36],
                        Day26: createValues[37],
                        Day27: createValues[38],
                        Day28: createValues[39],
                        Day29: createValues[40],
                        Day30: createValues[41],
                        Day31: createValues[42],
                        Week1: createValues[43],
                        Week2: createValues[44],
                        Week3: createValues[45],
                        Week4: createValues[46],
                        Week5: createValues[47],
                        Remarks: createValues[48],
                        RowState: 1,
                    }
                ]
            };

            const { key, num, ou, vehId, status, json } = await apiObj.create(
                payloadToSend,
                {
                    key: "RunDistHdrKey",
                    num: "RunDistNum",
                    ou: "OUKey",
                    vehId: "VehKey",
                }
            );

            expect([200, 201]).toContain(status);

            // Store state
            createdRecord = json;
            runDistHdrKey = key;
            runDistNum = num;
            ouKey = ou;
            vehKey = vehId;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Vehicle Running Distribution by HdrKey", async ({ api }) => {
            const keyToUse = runDistHdrKey || savedKey;
            apiObj.setUrl(`${vehUrl}/odata/RunDistHeader?RunDistHdrKey=${keyToUse}`);
            await apiObj.getByKey();
        });

        test("Get Vehicle Running Distribution details by HdrKey", async ({ api }) => {
            const keyToUse = runDistHdrKey || savedKey;
            const ouToUse = ouKey || savedOUKey;

            apiObj.setUrl(
                `${vehUrl}/odata/PRunDistDetail?&$filter=RunDistHdrKey+eq+${keyToUse}&&OUKey+eq+${ouToUse}&%24inlinecount=allpages`
            );
            await apiObj.getByKey();
        });

        test("Get Vehicle Running Distribution details & summary by HdrKey", async ({ api }) => {
            const keyToUse = runDistHdrKey || savedKey;
            const ouToUse = ouKey || savedOUKey;

            apiObj.setUrl(
                `${vehUrl}/odata/PRunDistDetail?Summary=true&RunDistHdrKey=${keyToUse}&&OUKey+eq+${ouToUse}&$expand=PSumRunDistDetail&%24inlinecount=allpages`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: UPDATE (POST) ---
        test("Update Vehicle Running Distribution transaction", async ({ api }) => {
            const keyToUse = runDistHdrKey || savedKey;
            const docNoToUse = runDistNum || savedDocNo;
            const vehToUse = vehKey || savedVehKey;
            
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            apiObj.setUrl(`${vehUrl}/api/RunDist`);
            
            const currentDate = new Date().toISOString().split("T")[0];

            // Update Payload using Object.assign pattern
            const updatePayload = {
                ...createdRecord,
                RunDistHdrKey: keyToUse,
                RunDistNum: docNoToUse,
                RunDistDate: currentDate,
                VehKey: vehToUse,
                RowState: 2,

                pRunDistDetails: [
                    Object.assign({}, createdRecord.pRunDistDetails[0], {
                        RunDistHdrKey: keyToUse,
                        Total: editValues[0],
                        Day01: editValues[1],
                        Day02: editValues[2],
                        Day03: editValues[3],
                        Day04: editValues[4],
                        Day05: editValues[5],
                        Day06: editValues[6],
                        Day07: editValues[7],
                        Day08: editValues[8],
                        Day09: editValues[9],
                        Day10: editValues[10],
                        Day11: editValues[11],
                        Day12: editValues[12],
                        Week1: editValues[13],
                        Week2: editValues[14],
                        Remarks: editValues[15],
                    })
                ]
            };

            const { status } = await apiObj.update("POST", updatePayload);
            expect([200, 201]).toContain(status);
        });

        // --- STEP 4: DELETE (API) ---
        test("Delete Vehicle Running Distribution transaction", async ({ api }) => {
            const keyToUse = runDistHdrKey || savedKey;
            
            apiObj.setUrl(`${vehUrl}/api/RunDist?key=${keyToUse}`);
            
            await apiObj.delete([200, 204]);
        });
    });
});