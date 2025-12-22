/**
 * INTER-OU VEHICLE RUNNING DISTRIBUTION (LOAN TO) API AUTOMATION TEST
 * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle.
 * Data Source: Excel Sheet 'VEHAPI_Data', Form: 'Inter-OU Vehicle Running Distribution (Loan To)'
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
let iRunDistHdrKey, iRunDistNum, ouKey, vehKey;
let createdRecord;

const vehUrl = VEH_API_URL;
const sheetName = "VEHAPI_Data";
const formName = "Inter OU Vehicle Running Distribution (Loan To)";

const basePayloads = VehiclePayloads["InterOUVehicleRunningDistribution(LoanTo)"];

const savedKey = ID["InterOUVehicleRunningDistribution(LoanTo)"].key;
const savedDocNo = ID["InterOUVehicleRunningDistribution(LoanTo)"].num;
const savedOUKey = ID["InterOUVehicleRunningDistribution(LoanTo)"].ou;
const savedVehKey = ID["InterOUVehicleRunningDistribution(LoanTo)"].vehId;

test.describe.serial("Inter-OU Vehicle Running Distribution (Loan To) API Test", () => {
    
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

        test("Add new Inter-OU Vehicle Running Distribution (Loan To) transaction", async ({ api }) => {
            // --- CREATE LOGIC ---
            apiObj.setUrl(`${vehUrl}/api/IntRunDist`);
            const currentDate = new Date().toISOString().split("T")[0];

            // Build Payload
            const payloadToSend = {
                ...basePayloads,
                RunDistDate: currentDate,
                VehKey: createValues[0],
                Remarks: createValues[1],
                OuKey: createValues[2],
                CreatedDate: currentDate,
                LastUpdatedDate: currentDate,
                RowState: 1,
                RegNo: createValues[3],
                AccKey: createValues[4],
                CCIDKey: createValues[5],

                // Map Details
                pRunDistDetails: [
                    {
                        ...basePayloads.pRunDistDetails[0],
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
                        Remarks: createValues[43],
                        RowState: 1,
                        Amount: createValues[44],
                    }
                ]
            };

            const { key, num, ou, vehId, status, json } = await apiObj.create(
                payloadToSend,
                {
                    key: "IntRunDistHdrKey",
                    num: "IRunDistNum",
                    ou: "OUKey",
                    vehId: "VehKey",
                }
            );

            expect([200, 201]).toContain(status);

            // Store state
            createdRecord = json;
            iRunDistHdrKey = key;
            iRunDistNum = num;
            ouKey = ou;
            vehKey = vehId;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Inter-OU Vehicle Running Distribution (Loan To) by HdrKey", async ({ api }) => {
            const keyToUse = iRunDistHdrKey || savedKey;
            apiObj.setUrl(`${vehUrl}/odata/IntRunDistHeader?IntRunDistHdrKey=${keyToUse}`);
            await apiObj.getByKey();
        });

        test("Get Inter-OU Vehicle Running Distribution (Loan To) details by HdrKey", async ({ api }) => {
            const keyToUse = iRunDistHdrKey || savedKey;
            const ouToUse = ouKey || savedOUKey;

            apiObj.setUrl(
                `${vehUrl}/odata/IntPRunDistDetail?&$filter=IntRunDistHdrKey+eq+${keyToUse}&&OUKey+eq+${ouToUse}&%24inlinecount=allpages`
            );
            await apiObj.getByKey();
        });

        test("Get Inter-OU Vehicle Running Distribution (Loan To) & summary by HdrKey", async ({ api }) => {
            const keyToUse = iRunDistHdrKey || savedKey;
            const ouToUse = ouKey || savedOUKey;

            apiObj.setUrl(
                `${vehUrl}/odata/IntPRunDistDetail?Summary=true&IntRunDistHdrKey=${keyToUse}&&OUKey+eq+${ouToUse}&$expand=PSumRunDistDetail&%24inlinecount=allpages`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: UPDATE (POST) ---
        test("Update Inter-OU Vehicle Running Distribution (Loan To) transaction", async ({ api }) => {
            const keyToUse = iRunDistHdrKey || savedKey;
            const docNoToUse = iRunDistNum || savedDocNo;
            const vehToUse = vehKey || savedVehKey;
            
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            apiObj.setUrl(`${vehUrl}/api/IntRunDist`);
            const currentDate = new Date().toISOString().split("T")[0];

            // Update Payload using hardcoded values as requested
            const updatePayload = {
                ...createdRecord,
                IntRunDistHdrKey: keyToUse,
                IRunDistNum: docNoToUse,
                RunDistDate: currentDate,
                VehKey: vehToUse,
                RowState: 2,

                pRunDistDetails: [
                    Object.assign({}, createdRecord.pRunDistDetails[0], {
                        IntRunDistHdrKey: keyToUse,
                        ClientKey: editValues[0], 
                        Total: editValues[1],
                        Day01: editValues[2],
                        Day02: editValues[3],
                        Day03: editValues[4],
                        Day04: editValues[5],
                        Day05: editValues[6],
                        Day06: editValues[7],
                        Day07: editValues[8],
                        Day08: editValues[9],
                        Day09: editValues[10],
                        Day10: editValues[11],
                        Day11: editValues[12],
                        Day12: editValues[13],
                        Day13: editValues[14],
                        Day14: editValues[15],
                        Day15: editValues[16],
                        Day16: editValues[17],
                        Day17: editValues[18],
                        Day18: editValues[19],
                        Day19: editValues[20],
                        Day20: editValues[21],
                        Day21: editValues[22],
                        Day22: editValues[23],
                        Day23: editValues[24],
                        Day24: editValues[25],
                        Day25: editValues[26],
                        Day26: editValues[27],
                        Day27: editValues[28],
                        Day28: editValues[29],
                        Day29: editValues[30],
                        Day30: editValues[31],
                        Day31: editValues[32],
                        Week1: editValues[33],
                        Week2: editValues[34],
                        Week3: editValues[35],
                        Week4: editValues[36],
                        Week5: editValues[37],
                        Remarks: editValues[38],
                        Amount: editValues[39],
                    })
                ]
            };

            const { status } = await apiObj.update("POST", updatePayload);
            expect([200, 201]).toContain(status);
        });

        // --- STEP 4: DELETE (API) ---
        test("Delete Inter-OU Vehicle Running Distribution (Loan To) transaction", async ({ api }) => {
            const keyToUse = iRunDistHdrKey || savedKey;
            
            apiObj.setUrl(`${vehUrl}/api/IntRunDist?key=${keyToUse}`);
            
            await apiObj.delete([200, 204]);
        });
    });
});