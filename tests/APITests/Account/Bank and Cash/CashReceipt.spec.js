/**
 * CASH RECEIPT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Cash Receipt form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Cash Receipt'
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
const sheetName = "ACCAPI_Data", formName = "Cash Receipt";
const basePayloads = AccountPayloads.CashReceipt;
const savedKey = ID.CashReceipt.HdrKey; // Fallback key
const savedDocNo = ID.CashReceipt.num;

test.describe.serial("Cash Receipt API Test", () => {
    
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
        test("Add new Cash Receipt", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27CR%27&Environment=qaa&AttachmentID=""`;
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
                createdDate: currentDate,
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
                        InvoiceDate: currentDate
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
                        Qty: createValues[39],
                        AccNumAccDesc: createValues[40],
                        CCIDCodeCCIDDesc: createValues[41],
                        rowid: createValues[42],
                        InvoiceDate: currentDate
                    },
                    {
                        ...basePayloads.glDetails[2],
                        AccKey: createValues[43],
                        AccNum: createValues[44],
                        AccDesc: createValues[45],
                        OUKey: createValues[46],
                        Remarks: createValues[47],
                        FuncTransAmt: createValues[48],
                        LocalTransAmt: createValues[49],
                        OrigTransAmt: createValues[50],
                        TaxableTransAmt: createValues[51],
                        InclusiveTransAmt: createValues[52],
                        OrigDrAmt: createValues[53],
                        OrigCrAmt: createValues[54],
                        DetRevAmt: createValues[55],
                        CCIDKey: createValues[56],
                        CCID: createValues[57]
                    }
                ],

                transDetBC: [
                    {
                        ...basePayloads.transDetBC[0],
                        PayTo: createValues[58]
                    }
                ]
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
        test("Get Cash Receipt by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Cash Receipts", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)&DocType=CR`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Cash Receipt", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27CR%27&Environment=qaa&AttachmentID=""`
            );

            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                RowState: 2, // 2 = Modified State
                DocAmt: editValues[0],
                Remarks: editValues[1],
                
                // Update specific rows in the glDetails array
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[2],
                        Remarks: editValues[3],
                        FuncTransAmt: editValues[4],
                        LocalTransAmt: editValues[5],
                        OrigTransAmt: editValues[6],
                        TaxableTransAmt: editValues[7],
                        InclusiveTransAmt: editValues[8],
                        OrigDrAmt: editValues[9],
                        OrigCrAmt: editValues[10],
                        DetRevAmt: editValues[11],
                        SetupPrimaryKey: editValues[12],
                        Qty: editValues[13]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[14],
                        Remarks: editValues[15],
                        FuncTransAmt: editValues[16],
                        LocalTransAmt: editValues[17],
                        OrigTransAmt: editValues[18],
                        TaxableTransAmt: editValues[19],
                        InclusiveTransAmt: editValues[20],
                        OrigDrAmt: editValues[21],
                        OrigCrAmt: editValues[22],
                        DetRevAmt: editValues[23],
                        SetupPrimaryKey: editValues[24],
                        Qty: editValues[25]
                    }),
                    Object.assign({}, createdRecord.glDetails[2], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[26],
                        OUCode: editValues[27],
                        Remarks: editValues[28],
                        FuncTransAmt: editValues[29],
                        LocalTransAmt: editValues[30],
                        OrigTransAmt: editValues[31],
                        TaxableTransAmt: editValues[32],
                        InclusiveTransAmt: editValues[33],
                        OrigDrAmt: editValues[34],
                        OrigCrAmt: editValues[35],
                        DetRevAmt: editValues[36],
                        SetupPrimaryKey: editValues[37],
                        AccNumAccDesc: editValues[38],
                        CCIDCodeCCIDDesc: editValues[39]
                    })
                ],

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
        test("Delete Cash Receipt using SQL(Clean Up)", async () => {
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