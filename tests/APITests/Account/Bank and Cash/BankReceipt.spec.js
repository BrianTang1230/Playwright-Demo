/**
 * BANK RECEIPT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Bank Receipt form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Bank Receipt'
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
const sheetName = "ACCAPI_Data", formName = "Bank Receipt";
const basePayloads = AccountPayloads.BankReceipt;
const savedKey = ID.BankReceipt.TransHdrKey; // Fallback key
const savedDocNo = ID.BankReceipt.num;

test.describe.serial("Bank Receipt API Test", () => {
    
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
        test("Add new Bank Receipt", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27BR%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            // Dynamic Dates
            const currentDate = new Date().toISOString();

            // Construct Payload: Merging base template with Excel data
            // We use Spread Syntax (...) for cleaner mapping of large objects
            const payload = {
                ...basePayloads,
                OUKey: createValues[0],
                OUDesc: createValues[1],
                GLDate: currentDate,
                GLDesc: createValues[2],
                DocAmt: createValues[3],
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                Remarks: createValues[4],
                RefNo: createValues[5],
                
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[6],
                        AccNum: createValues[7],
                        AccDesc: createValues[8],
                        OUKey: createValues[9],
                        Remarks: createValues[10],
                        FuncTransAmt: createValues[11],
                        LocalTransAmt: createValues[12],
                        OrigTransAmt: createValues[13],
                        TaxableTransAmt: createValues[14],
                        InclusiveTransAmt: createValues[15],
                        OrigDrAmt: createValues[16],
                        OrigCrAmt: createValues[17],
                        DetRevAmt: createValues[18],
                        CCIDKey: createValues[19],
                        CCID: createValues[20],
                        AccNumAccDesc: createValues[21],
                        CCIDCodeCCIDDesc: createValues[22],
                        rowid: createValues[23],
                        InvoiceDate: currentDate,
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[24],
                        AccNum: createValues[25],
                        AccDesc: createValues[26],
                        OUKey: createValues[27],
                        Remarks: createValues[28],
                        FuncTransAmt: createValues[29],
                        LocalTransAmt: createValues[30],
                        OrigTransAmt: createValues[31],
                        TaxableTransAmt: createValues[32],
                        InclusiveTransAmt: createValues[33],
                        OrigDrAmt: createValues[34],
                        OrigCrAmt: createValues[35],
                        DetRevAmt: createValues[36],
                        CCIDKey: createValues[37],
                        CCID: createValues[38],
                    }
                ],

                transDetBC: [
                    {
                        ...basePayloads.transDetBC[0],
                        PayTo: createValues[39],
                        BenKey: createValues[40],
                    }
                ]
            };

            // Note: Bank Receipt uses 'HdrKey' in return object
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
        test("Get Bank Receipt by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Bank Receipt", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,ChequeNo,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=BR`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Bank Receipt", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27BR%27&Environment=qaa&AttachmentID=""`
            );
            
            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                DocAmt: editValues[0],
                PayTermKey: editValues[1],
                RowState: 2, // 2 = Modified State
                
                
                // Update specific rows in the glDetails array
                // Note: Original code only updated the second detail (index 1)
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[2],
                        OUCode: editValues[3],
                        Remarks: editValues[4],
                        FuncTransAmt: editValues[5],
                        LocalTransAmt: editValues[6],
                        OrigTransAmt: editValues[7],
                        TaxableTransAmt: editValues[8],
                        InclusiveTransAmt: editValues[9],
                        OrigDrAmt: editValues[10],
                        OrigCrAmt: editValues[11],
                        DetRevAmt: editValues[12],
                        SetupPrimaryKey: editValues[13],
                    }),

                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[14],
                        OUCode: editValues[15],
                        Remarks: editValues[16],
                        FuncTransAmt: editValues[17],
                        LocalTransAmt: editValues[18],
                        OrigTransAmt: editValues[19],
                        TaxableTransAmt: editValues[20],
                        InclusiveTransAmt: editValues[21],
                        OrigDrAmt: editValues[22],
                        OrigCrAmt: editValues[23],
                        DetRevAmt: editValues[24],
                        SetupPrimaryKey: editValues[25],
                    })
                ],

                // Update Bank Transaction Details
                transDetBC: [
                    Object.assign({}, createdRecord.transDetBC[0], {
                        TransHdrKey: keyToUse
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