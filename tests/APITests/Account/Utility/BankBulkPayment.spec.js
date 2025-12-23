/**
 * BANK BULK PAYMENT API AUTOMATION TEST
 * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Bank Bulk Payment'
 * Note: Delete operation uses a specific POST endpoint (/api/BP/Delete).
 */

import { test } from "@utils/commonFunctions/GlobalSetup";
import { expect } from "@playwright/test";
import ApiCallBase from "@ApiFolder/pages/ApiPages.js";
import {
  AccountJsonPath,
  ACC_API_URL,
  ID,
  AccountPayloads,
} from "@utils/data/apidata/accountApiData.json";

// Global variables to maintain state
let apiObj, createValues, editValues;
let BPHdrKey, DocNum;
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Bank Bulk Payment";
const basePayloads = AccountPayloads.BankBulkPayment;

// Fallback keys if test is run individually without create
const savedKey = ID.BankBulkPayment?.key;
const savedDocNo = ID.BankBulkPayment?.num;

test.describe.serial("Bank Bulk Payment API Test", () => {
    
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
        test("Add new Bank Bulk Payment", async ({ api }) => {
            apiObj.setUrl(`${accUrl}/api/BP`);
            
            const currentDate = new Date().toISOString();

            // Build Payload
            const payloadToSend = {
                ...basePayloads,
                OUCode: createValues[0],
                BPDate: currentDate,
                Status: createValues[1],
                BankCode: createValues[2],
                BankName: createValues[3],
                CurrCode: createValues[4],
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                ApprovedDate: currentDate,
                VoidDate: currentDate,
                
                // Map Details
                bpDetails: [
                    {
                        ...basePayloads.bpDetails?.[0],
                        TransHdrKey: createValues[5],
                        TransDetKey: createValues[6],
                        OUCode: createValues[7],
                        CurrCode: createValues[8],
                        PymtType: createValues[9],
                        PymtTypeid: createValues[10],
                        GLDate: createValues[11],
                        GLDesc: createValues[12],
                        BeneficiaryName: createValues[13],
                        BankAccNum: createValues[14],
                        PaymentAmt: createValues[15],
                        BankName: createValues[16],
                        Email: createValues[17]
                    }
                ]
            };

            const { key, num, status, json } = await apiObj.create(
                payloadToSend,
                {
                    key: "BPHdrKey",
                    num: "DocNum",
                }
            );

            expect([200, 201]).toContain(status);

            // Store state
            createdRecord = json;
            BPHdrKey = key;
            DocNum = num;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Bank Bulk Payment by HdrKey", async ({ api }) => {
            const keyToUse = BPHdrKey || savedKey;

            apiObj.setUrl(
                `${accUrl}/odata/BPHeader?$filter=BPHdrKey eq ${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Bank Bulk Payment transactions", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/BPHeader?$format=json&$orderby=BPDate desc,BPHdrKey&$select=BPHdrKey,OUCode,DocNum,BPDate,BankCode,BankName,CurrCode&$inlinecount=allpages&$top=20&$filter=OUCode eq 'UMBB'`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Bank Bulk Payment transaction", async ({ api }) => {
            const keyToUse = BPHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;

            expect(createdRecord, "The 'createdRecord' is not available. Ensure create step passed.").toBeDefined();

            apiObj.setUrl(`${accUrl}/api/BP`);
            const currentDate = new Date().toISOString();

            // Update Payload using Object.assign pattern
            const updatePayload = {
                ...createdRecord,
                BPHdrKey: keyToUse,
                DocNum: docNoToUse,
                OUCode: editValues[0],
                Status: editValues[1],
                BankCode: editValues[2],
                BankName: editValues[3],
                CurrCode: editValues[4],
                BPDate: currentDate,
                ApprovedDate: currentDate,
                VoidDate: currentDate,
                RowState: 2, // Modified State

                // Update Details
                bpDetails: [
                    Object.assign({}, createdRecord.bpDetails[0], {
                        BPHdrKey: keyToUse,
                        TransHdrKey: editValues[5],
                        TransDetKey: editValues[6],
                    })
                ]
            };

            const { status } = await apiObj.update("POST", updatePayload);
            expect([200, 201]).toContain(status);
        });

        // --- STEP 5: DELETE (CUSTOM POST) ---
        test("Delete Bank Bulk Payment transaction", async ({ api }) => {
            const keyToUse = BPHdrKey || savedKey;

            // This API uses a specific POST endpoint for deletion instead of standard DELETE
            const deleteUrl = `${accUrl}/api/BP/Delete?BPHdrKey=${keyToUse}`;

            console.log(`Attempting to delete record with Key: ${keyToUse}`);

            const response = await api.post(deleteUrl, {
                headers: { "Content-Type": "application/json" },
            });

            const status = response.status();
            
            // Log response body for debugging
            let json = {};
            try {
                json = await response.json();
            } catch {
                console.log("No JSON response body (204 No Content)");
            }
            console.log("Delete Response:", json);

            // Assert success (200 OK or 204 No Content)
            expect([200, 204]).toContain(status);
        });
    });
});