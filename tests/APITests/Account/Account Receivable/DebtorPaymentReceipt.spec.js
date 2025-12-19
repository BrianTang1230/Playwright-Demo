/**
 * DEBTOR PAYMENT RECEIPT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Debtor Payment Receipt form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Debtor Payment Receipt'
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
const sheetName = "ACCAPI_Data", formName = "Debtor Payment Receipt";
const basePayloads = AccountPayloads.DebtorPaymentReceipt;
const savedKey = ID.DebtorPaymentReceipt.TransHdrKey; // Fallback key
const savedDocNo = ID.DebtorPaymentReceipt.num;

test.describe.serial("Debtor Payment Receipt API Test", () => {
    
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
        test("Add new Debtor Payment Receipt", async ({ api }) => {
            const apiUrl = `${accUrl}/api/DPRecv?form=%27DPRecv%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            // Dynamic Dates
            const currentDate = new Date().toISOString();

            // Construct Payload: Merging base template with Excel data
            // We use Spread Syntax (...) for cleaner mapping of large objects
            const payload = {
                ...basePayloads,
                OUKey: createValues[0],
                OUCode: createValues[1],
                OUDesc: createValues[2],
                GLDate: currentDate,
                GLDesc: createValues[3],
                DocAmt: createValues[4],
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                Remarks: createValues[5],
                RefNo: createValues[6],
                
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[7],
                        AccNum: createValues[8],
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
                        CCID: createValues[20]
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[21],
                        AccNum: createValues[22],
                        AccDesc: createValues[23],
                        OUKey: createValues[24],
                        Remarks: createValues[25],
                        FuncTransAmt: createValues[26],
                        LocalTransAmt: createValues[27],
                        OrigTransAmt: createValues[28],
                        TaxableTransAmt: createValues[29],
                        InclusiveTransAmt: createValues[30],
                        OrigDrAmt: createValues[31],
                        OrigCrAmt: createValues[32],
                        DetRevAmt: createValues[33],
                        CCIDKey: createValues[34],
                        CCID: createValues[35]
                    }
                ],

                glDetailsAPAR: [
                    {
                        ...basePayloads.glDetailsAPAR[0],
                        AccKey: createValues[36],
                        AccNum: createValues[37],
                        OUKey: createValues[38],
                        OUCode: createValues[39],
                        Remarks: createValues[40],
                        FuncTransAmt: createValues[41],
                        LocalTransAmt: createValues[42],
                        OrigTransAmt: createValues[43],
                        CCIDKey: createValues[44],
                        CCID: createValues[45],
                        APARRefTransDetKey: createValues[46],
                        APARRefTransHdrKey: createValues[47],
                        DocNum: createValues[48],
                        InvNum: createValues[49],
                        GLDate: createValues[50],
                        DueDate: createValues[51],
                        GLDesc: createValues[52],
                        OpenAmt: createValues[53],
                        AppliedAmt: createValues[54],
                        TaxableAmt: createValues[55]
                    },
                    {
                        ...basePayloads.glDetailsAPAR[1],
                        AccKey: createValues[56],
                        AccNum: createValues[57],
                        OUKey: createValues[58],
                        OUCode: createValues[59],
                        Remarks: createValues[60],
                        FuncTransAmt: createValues[61],
                        LocalTransAmt: createValues[62],
                        OrigTransAmt: createValues[63],
                        CCID: createValues[64],
                        APARRefTransDetKey: createValues[65],
                        APARRefTransHdrKey: createValues[66],
                        DocNum: createValues[67],
                        InvNum: createValues[68],
                        GLDate: createValues[69],
                        DueDate: createValues[70],
                        OpenAmt: createValues[71],
                        AppliedAmt: createValues[72],
                        TaxableAmt: createValues[73]
                    }
                ],

                TransDetBCKey: [
                    {
                        ...(basePayloads.TransDetBCKey ? basePayloads.TransDetBCKey[0] : {}),
                        TransDetBCKey: createValues[74],
                        PayTo: createValues[75],
                        BenKey: createValues[76]
                    }
                ]
            };

            const { key, num, status, json } = await apiObj.create(
                payload,
                { key: "TransHdrKey", num: "DocNum" }
            );

            expect([200, 201]).toContain(status);
            
            // Store response for next steps
            createdRecord = json;
            TransHdrKey = key;
            DocNum = num;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Debtor Payment Receipt by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Debtor Payment Receipt", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,CCIDCodeCCIDDesc%20asc,TransHdrKey&$select=TransHdrKey,OUCode,OUKey,DocNum,RefNo,Source,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=FY%20eq%202025&DocType=DRP`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Debtor Payment Receipt", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/DPRecv?form=%27DPRecv%27&Environment=qaa&AttachmentID=""`
            );
            
            // Payload Construction:
            // Clone record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                RowState: 2, // 2 = Modified State
                
                // Update specific rows in glDetails
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransDetKey: editValues[0],
                        TranHdrKey: editValues[1],
                        Remarks: editValues[2],
                        AccNumAccDesc: editValues[3],
                        CCIDCodeCCIDDesc: editValues[4]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        Remarks: editValues[5],
                        AccNumAccDesc: editValues[6],
                        CCIDCodeCCIDDesc: editValues[7]
                    })
                ],

                // Update specific rows in glDetailsAPAR
                glDetailsAPAR: [
                    Object.assign({}, createdRecord.glDetailsAPAR[0], {
                        TransDetBCKey: editValues[8],
                        TransDetKey: editValues[9],
                        TransHdrKey: editValues[10],
                        AccDesc: editValues[11]
                    }),
                    Object.assign({}, createdRecord.glDetailsAPAR[1], {
                        TransDetBCKey: editValues[12],
                        TransDetKey: editValues[13],
                        TransHdrKey: editValues[14],
                        AccDesc: editValues[15]
                    })
                ],

                // Update Bank Details
                transDetBC: [
                    Object.assign({}, createdRecord.transDetBC[0], {
                        TransDetBCKey: editValues[16],
                        TransHdrKey: editValues[17],
                        TransferNo: editValues[18]
                    })
                ]
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Debtor Payment Receipt using SQL(Clean Up)", async () => {
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