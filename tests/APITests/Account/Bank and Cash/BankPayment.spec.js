/**
 * BANK PAYMENT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Bank Payment form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Bank Payment'
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
import { create } from "domain";

// Global variables to maintain state across tests (Create -> Update -> Delete)
let apiObj, createValues, editValues, TransHdrKey, DocNum, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data", formName = "Bank Payment";
const basePayloads = AccountPayloads.BankPayment;
const savedKey = ID.BankPayment.TransHdrKey; // Fallback key
const savedDocNo = ID.BankPayment.num;

test.describe.serial("Bank Payment API Test", () => {
    
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
        test("Add new Bank Payment", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27BP%27&Environment=qaa&AttachmentID=""`;
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
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                Remarks: createValues[4],
                RefNo: createValues[5],
                BankDueDate: currentDate,

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
                        Qty: createValues[21],
                        AccNumAccDesc: createValues[22],
                        CCIDCodeCCIDDesc: createValues[23],
                        rowid: createValues[24],
                        InvoiceDate: currentDate,
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[25],
                        AccNum: createValues[26],
                        AccDesc: createValues[27],
                        OUKey: createValues[28],
                        Remarks: createValues[29],
                        FuncTransAmt: createValues[30],
                        LocalTransAmt: createValues[31],
                        OrigTransAmt: createValues[32],
                        TaxableTransAmt: createValues[33],
                        InclusiveTransAmt: createValues[34],
                        OrigDrAmt: createValues[35],
                        OrigCrAmt: createValues[36],
                        DetRevAmt: createValues[37],
                        CCIDKey: createValues[38],
                        CCID: createValues[39],
                    }
                ],

                transDetBC: [
                    {
                        ...basePayloads.transDetBC[0],
                        PayTo: createValues[40],
                        TransferNo: createValues[41],
                        BenKey: createValues[42],
                    }
                ]
            };

            // Note: Bank Payment returns 'HdrKey' instead of 'key' in some versions, mapping accordingly
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
        test("Get Bank Payment by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Bank Payment transactions", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,ChequeNo,TransferNo,IsContainAttach,BankDueDate,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=BP`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Bank Payment transaction", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27BP%27&Environment=qaa&AttachmentID=""`
            );
            
            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                RowState: 2, // 2 = Modified State
                DocAmt: editValues[0],
                
                // Update specific rows in the glDetails array
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[1],
                        Remarks: editValues[2],
                        FuncTransAmt: editValues[3],
                        LocalTransAmt: editValues[4],
                        OrigTransAmt: editValues[5],
                        TaxableTransAmt: editValues[6],
                        InclusiveTransAmt: editValues[7],
                        OrigDrAmt: editValues[8],
                        OrigCrAmt: editValues[9],
                        DetRevAmt: editValues[10],
                        SetupPrimaryKey: editValues[11],
                        Qty: editValues[12],
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        AccDesc: editValues[13],
                        ClientKey: editValues[14],
                        FuncTransAmt: editValues[15],
                        LocalTransAmt: editValues[16],
                        OrigTransAmt: editValues[17],
                        TaxableTransAmt: editValues[18],
                        InclusiveTransAmt: editValues[19],
                        OrigDrAmt: editValues[20],
                        OrigCrAmt: editValues[21],
                        DetRevAmt: editValues[22],
                        SetupPrimaryKey: editValues[23],
                        AccNumAccDesc: editValues[24],
                        CCIDCodeCCIDDesc: editValues[25],
                    })
                ],

                // Update Bank Transaction Details
                transDetBC: [
                    Object.assign({}, createdRecord.transDetBC[0], {
                        TransHdrKey: keyToUse,
                        RowState: 2,
                    })
                ]
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Bank payment using SQL(Clean Up)", async () => {
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