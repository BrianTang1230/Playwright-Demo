/**
 * CASH PAYMENT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Cash Payment form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Cash Payment'
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

// Global variables to maintain state across tests (Create -> Update -> Delete)
let apiObj, createValues, editValues, TransHdrKey, DocNum, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data", formName = "Cash Payment";
const basePayloads = AccountPayloads.CashPayment;
const savedKey = ID.CashPayment.HdrKey; // Fallback key
const savedDocNo = ID.CashPayment.num;

test.describe.serial("Cash Payment API Test", () => {
    
    // --- SETUP: Load Data & Initialize API Wrapper ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // force API mode
        
        // Load test data from Excel into arrays (createValues = Row 1, editValues = Row 2)
        [createValues, editValues] = await excel.loadExcelValues(
            sheetName,
            formName,
            { isUI: false }
        );
        
        // Initialize the API Page Object Model
        apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
    });

    // Rebind the fresh API context before every individual test
    test.beforeEach(async ({ api }) => {
        apiObj.api = api;
    });

    test.describe("CRUD Operation Testing", () => {
        
        // --- STEP 1: CREATE (POST) ---
        test("Add new Cash Payment transaction", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27CP%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            // Dynamic Dates
            const currentDate = new Date().toISOString();

            // Construct Payload: Merging base template with dynamic data
            // We use Spread Syntax (...) for cleaner mapping
            const payload = {
                ...basePayloads,
                InvoiceDate: currentDate
            };

            const { HdrKey, num, status, json } = await apiObj.create(
                payload,
                { HdrKey: "TransHdrKey", num: "DocNum" }
            );
            
            expect([200, 201]).toContain(status);
            
            // Store response for next steps
            createdRecord = json;
            TransHdrKey = HdrKey;
            DocNum = num;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Cash Payment transaction by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Cash Payment transactions", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=CP`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Cash Payment transaction", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27CP%27&Environment=qaa&AttachmentID=""`
            );

            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                RowState: 2, // 2 = Modified State
                OUDesc: editValues[0],
                DocAmt: editValues[1],
                RefNo: editValues[2],
                Remarks: editValues[3],
                
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
                        AccNum: editValues[4],
                        AccDesc: editValues[5],
                        Remarks: editValues[6],
                        FuncTransAmt: editValues[7],
                        LocalTransAmt: editValues[8],
                        OrigTransAmt: editValues[9],
                        InclusiveTransAmt: editValues[10],
                        OrigCrAmt: editValues[11],
                        DetRevAmt: editValues[12],
                        CCID: editValues[13],
                        AccNumAccDesc: editValues[14],
                        CCIDCodeCCIDDesc: editValues[15],
                        IsRequiredCCID: editValues[16]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        AccNum: editValues[17],
                        AccDesc: editValues[18],
                        Remarks: editValues[19],
                        FuncTransAmt: editValues[20],
                        LocalTransAmt: editValues[21],
                        OrigTransAmt: editValues[22],
                        InclusiveTransAmt: editValues[23],
                        OrigDrAmt: editValues[24],
                        DetRevAmt: editValues[25],
                        CCID: editValues[26],
                        AccNumAccDesc: editValues[27],
                        CCIDCodeCCIDDesc: editValues[28],
                        IsRequiredCCID: editValues[29]
                    })
                ],

                transDetBC: [
                    Object.assign({}, createdRecord.transDetBC[0], {
                        PayTo: "BANGUNAN KWSP K.K"
                    })
                ]
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Bank Receipt using SQL(Clean Up)", async () => {
            // Validate key exists to prevent accidental deletion of wrong records
            expect(TransHdrKey, "TransHdrKey is not available. The 'create' test must have run successfully.").toBeDefined();
            
            console.log(`Attempting to delete record with TransHdrKey: ${TransHdrKey}`);
            
            try {
                // Execute direct SQL deletion to clean up test data
                await deleteBankPaymentById(TransHdrKey);
                console.log("SQL delete function executed successfully.");
            } catch (error) {
                // Explicitly throw error to fail test if cleanup fails
                throw new Error(`Database cleanup failed for TransHdrKey ${TransHdrKey}. Reason: ${error.message}`);
            }
        })
    });
});