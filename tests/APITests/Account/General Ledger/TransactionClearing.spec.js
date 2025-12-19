/**
 * TRANSACTION CLEARING API AUTOMATION TEST
 * Purpose: Validates the CRUD lifecycle.
 * Form: Transaction Clearing (CT)
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
import { deleteBankPaymentById } from "testsfolders/ApiTestsFolder/queries/AccountQuery"; 

// Global variables
let apiObj, createValues, editValues, TransHdrKey, DocNum, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Transaction Clearing";
const basePayloads = AccountPayloads.TransactionClearing;
const savedKey = ID.TransactionClearing.TransHdrKey;
const savedDocNo = ID.TransactionClearing.num;

test.describe.serial("Transaction Clearing API Test", () => {
    
    // --- SETUP ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false);
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
        
        // --- STEP 1: CREATE (SINGLE STEP) ---
        test("Add new Transaction Clearing record", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27CT%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            const currentDate = new Date().toISOString();

            // Construct Single Payload (Header + Details)
            const payload = {
                ...basePayloads,
                ClientKey: createValues[0],
                OUKey: createValues[1],
                OUCode: createValues[2],
                OUDesc: createValues[3],
                GLDate: currentDate,
                GLDesc: createValues[4],
                DocAmt: createValues[5],
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[6],
                        AccNum: createValues[7],
                        ClientKey: createValues[8],
                        OUKey: createValues[9],
                        Remarks: createValues[10],
                        FuncTransAmt: createValues[11],
                        LocalTranAmt: createValues[12],
                        OrigTransAmt: createValues[13],
                        TaxableTransAmt: createValues[14],
                        InclusiveTransAmt: createValues[15],
                        OrigDrAmt: createValues[16],
                        OrigCrAmt: createValues[17],
                        DetRevAmt: createValues[18],
                        CCIDKey: createValues[19],
                        CCID: createValues[20],
                        APARRefTransDetKey: createValues[21],
                        APARRefTransHdrKey: createValues[22],
                        DocNum: createValues[23],
                        OpenAmt: createValues[24],
                        AccNumAccDesc: createValues[25],
                        CCIDCodeCCIDDesc: createValues[26],
                        AppliedAmt: createValues[27],
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[28],
                        AccNum: createValues[29],
                        ClientKey: createValues[30],
                        OUKey: createValues[31],
                        Remarks: createValues[32],
                        FuncTransAmt: createValues[33],
                        LocalTransAmt: createValues[34],
                        OrigTransAmt: createValues[35],
                        TaxableTransAmt: createValues[36],
                        InclusiveTransAmt: createValues[37],
                        OrigDrAmt: createValues[38],
                        OrigCrAmt: createValues[39],
                        DetRevAmt: createValues[40],
                        CCIDKey: createValues[41],
                        CCID: createValues[42],
                        DocNum: createValues[43],
                        OpenAmt: createValues[44],
                        AccNumAccDesc: createValues[45],
                        CCIDCodeCCIDDesc: createValues[46],
                        AppliedAmt: createValues[47],
                    }
                ]
            };

            const { HdrKey, num, status, json } = await apiObj.create(
                payload,
                { HdrKey: "TransHdrKey", num: "DocNum" }
            );

            expect([200, 201]).toContain(status);
            
            // Store state
            createdRecord = json;
            TransHdrKey = HdrKey;
            DocNum = num;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Transaction Clearing records by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Transaction Clearing records", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsContainAttach,IsSelect,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=CT`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Transaction Clearing record", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
            
            apiObj.setUrl(`${accUrl}/api/GL?form=%27CT%27&Environment=qaa&AttachmentID=""`);
            
            // Clone & Update Header
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                RowState: 2,
                
                // Update Details using Object.assign logic
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                    })
                ]
            };
            
            const { status } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Transaction Clearing Record using SQL(Clean Up)", async () => {
            expect(TransHdrKey, "TransHdrKey is not available.").toBeDefined();
            
            console.log(`Attempting to delete record with TransHdrKey: ${TransHdrKey}`);
            
            try {
                await deleteBankPaymentById(TransHdrKey);
                console.log("SQL delete function executed successfully.");
            } catch (error) {
                throw new Error(`Database cleanup failed for TransHdrKey ${TransHdrKey}. Reason: ${error.message}`);
            }
        });
    });
});