/**
 * UNCULTIVATED AREA API AUTOMATION TEST
 * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Uncultivated Area form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Uncultivated Area'
 */

import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ConnectExcel from "@utils/excel/ConnectExcel";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import {
  AccountJsonPath,
  ACC_API_URL,
  ID,
  AccountPayloads,
} from "@utils/data/apidata/accountApiData.json";

// Global variables to maintain state
let apiObj, createValues, editValues;
let UnculAreaHdrKey, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Uncultivated Area";
const basePayloads = AccountPayloads.UncultivatedArea;
const savedKey = ID.UncultivatedArea.UnculAreaHdrKey;

test.describe.serial("Uncultivated Area API Test", () => {
    
    // --- SETUP ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // Force API mode
        [createValues, editValues] = await excel.loadExcelValues(
            sheetName,
            formName,
            { isUI: false }
        );
        apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
    });

    test.beforeEach(async ({ api }) => {
        apiObj.api = api;
    });

    test.describe("CRUD Operation Testing", () => {

        // --- STEP 1: CREATE (POST) ---
        test("Add new Uncultivated Area", async ({ api }) => {
            const apiUrl = `${accUrl}/api/UnculAreaFIN?form=%27UNCULAREA%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            const currentDate = new Date().toISOString();

            // Build Payload using Spread Syntax (...)
            const payload = {
                ...basePayloads,
                OUKey: createValues[0],
                Remark: createValues[1],
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                
                // Map Details
                addUnculAreaDetails: [
                    {
                        ...basePayloads.addUnculAreaDetails[0],
                        UnculAreaKey: createValues[2],
                        UnculAreaCode: createValues[3],
                        UnculAreaDesc: createValues[4],
                        UnculAreaCodeDesc: createValues[5],
                        Area: createValues[6]
                    }
                ]
            };

            const { key, num, status, json } = await apiObj.create(
                payload,
                { key: "UnculAreaHdrKey" }
            );

            expect([200, 201]).toContain(status);
            
            createdRecord = json;
            UnculAreaHdrKey = key;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Uncultivated Area by HdrKey", async ({ api }) => {
            const keyToUse = UnculAreaHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/UnculAreaHdr?HdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Uncultivated Area", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/UnculAreaHdr?$expand=addUnculAreaDetails&$format=json&$orderby=FY%20desc,Period%20asc,UnculAreaHdrKey&$select=UnculAreaHdrKey,OUCode,FY,DisplayYr,Period,Remark,DivCodeDesc,CreatedByCode,LastUpdatedByCode,IsContainAttach,IsSelect&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Uncultivated Area", async ({ api }) => {
            const keyToUse = UnculAreaHdrKey || savedKey;
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            apiObj.setUrl(
                `${accUrl}/api/UnculAreaFIN?form=%27UNCULAREA%27&Environment=qaa&AttachmentID=""`
            );

            // Payload Construction:
            // Clone the record and use Object.assign for clean updates
            const updatePayload = {
                ...createdRecord,
                UnculAreaHdrKey: keyToUse,
                Remark: editValues[0],
                RowState: 2, // Modified State

                addUnculAreaDetails: [
                    // Update Line 1
                    Object.assign({}, createdRecord.addUnculAreaDetails[0], {
                        ClientKey: editValues[1],
                        Area: editValues[2]
                    }),

                    Object.assign({}, createdRecord.addUnculAreaDetails[1], {
                        ClientKey: editValues[3],
                        UnculAreaHdrKey: keyToUse,
                        UnculAreaKey: editValues[4],
                        UnculAreaCode: editValues[5],
                        UnculAreaDesc: editValues[6],
                        UnculAreaCodeDesc: editValues[7],
                        Area: editValues[8]
                    })
                ]
            };

            const { status } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (API) ---
        test("Delete Uncultivated Area", async ({ api }) => {
            const keyToUse = UnculAreaHdrKey || savedKey;

            apiObj.setUrl(`${accUrl}/api/UnculAreaFIN?key=${keyToUse}`);

            await apiObj.delete();
        });
    });
});