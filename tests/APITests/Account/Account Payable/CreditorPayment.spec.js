/*
 * CREDITOR PAYMENT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Creditor Payment form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Creditor Payment'
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
const sheetName = "ACCAPI_Data", formName = "Creditor Payment";
const basePayloads = AccountPayloads.CreditorPayment;
const savedKey = ID.CreditorPayment.TransHdrKey; // Fallback key if creation fails
const savedDocNo = ID.CreditorPayment.num;

test.describe.serial("Creditor Payment API Test", () => {
    
    // --- SETUP: Load Data & Initialize API Wrapper ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // force API mode (no UI interaction)
        
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
        test("Add new Creditor Payment", async ({ api }) => {
            const apiUrl = `${accUrl}/api/CP?form=%27CP%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
            apiObj.setUrl(apiUrl);

            // Dynamic Dates: Current date and Due Date (Current + 30 days)
            const currentDate = new Date().toISOString();
            const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 30);

            // Construct Payload: Merging base template with Excel data
            // We use Spread Syntax (...) for cleaner mapping of large objects
            const payload = {
                ...basePayloads,
                OUKey: createValues[0],
                OUCode: createValues[1],
                OUDesc: createValues[2],
                DocNum: createValues[3],
                GLDate: currentDate,
                GLDesc: createValues[4],
                DocAmt: createValues[5],
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                Remarks: createValues[6],
                RefNo: createValues[7],
                BankDueDate: dueDate.toISOString(),
                
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[8],
                        AccNum: createValues[9],
                        AccDesc: createValues[10],
                        OUKey: createValues[11],
                        Remarks: createValues[12],
                        FuncTransAmt: createValues[13],
                        LocalTransAmt: createValues[14],
                        OrigTransAmt: createValues[15],
                        TaxableTransAmt: createValues[16],
                        InclusiveTransAmt: createValues[17],
                        OrigDrAmt: createValues[18],
                        OrigCrAmt: createValues[19],
                        DetRevAmt: createValues[20],
                        CCIDKey: createValues[21],
                        CCID: createValues[22]
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[23],
                        AccNum: createValues[24],
                        OUKey: createValues[25],
                        Remarks: createValues[26],
                        FuncTransAmt: createValues[27],
                        LocalTransAmt: createValues[28],
                        OrigTransAmt: createValues[29],
                        TaxableTransAmt: createValues[30],
                        InclusiveTransAmt: createValues[31],
                        OrigDrAmt: createValues[32],
                        OrigCrAmt: createValues[33],
                        DetRevAmt: createValues[34],
                        CCIDKey: createValues[35],
                        CCID: createValues[36]
                    }
                ],

                glDetailsAPAR: [
                    {
                        ...basePayloads.glDetailsAPAR[0],
                        AccKey: createValues[37],
                        AccNum: createValues[38],
                        OUKey: createValues[39],
                        OUCode: createValues[40],
                        Remarks: createValues[41],
                        FuncTransAmt: createValues[42],
                        LocalTransAmt: createValues[43],
                        OrigTransAmt: createValues[44],
                        CCIDKey: createValues[45],
                        CCID: createValues[46],
                        APARRefTransDetKey: createValues[47],
                        APARRefTransHdrKey: createValues[48],
                        DocNum: createValues[49],
                        GLDate: createValues[50],
                        DueDate: createValues[51],
                        GLDesc: createValues[52],
                        OpenAmt: createValues[53],
                        AppliedAmt: createValues[54],
                        Discount: createValues[55],
                        TaxAmt: createValues[56],
                        TaxableAmt: createValues[57]
                    },
                    {
                        ...basePayloads.glDetailsAPAR[1],
                        AccKey: createValues[58],
                        AccNum: createValues[59],
                        OUKey: createValues[60],
                        OUCode: createValues[61],
                        Remarks: createValues[62],
                        FuncTransAmt: createValues[63],
                        LocalTransAmt: createValues[64],
                        OrigTransAmt: createValues[65],
                        CCID: createValues[67], 
                        APARRefTransDetKey: createValues[68],
                        APARRefTransHdrKey: createValues[69],
                        DocNum: createValues[70],
                        InvNum: createValues[71],
                        GLDate: createValues[72],
                        DueDate: createValues[73],
                        GLDesc: createValues[74],
                        OpenAmt: createValues[75],
                        AppliedAmt: createValues[76],
                        Discount: createValues[77],
                        TaxAmt: createValues[78],
                        TaxableAmt: createValues[79]
                    },
                    {
                        ...basePayloads.glDetailsAPAR[2],
                        AccKey: createValues[80],
                        AccNum: createValues[81],
                        OUKey: createValues[82],
                        OUCode: createValues[83],
                        Remarks: createValues[84],
                        FuncTransAmt: createValues[85],
                        LocalTransAmt: createValues[86],
                        OrigTransAmt: createValues[87],
                        CCID: createValues[89],
                        APARRefTransDetKey: createValues[90],
                        APARRefTransHdrKey: createValues[91],
                        DocNum: createValues[92],
                        InvNum: createValues[93],
                        GLDate: createValues[94],
                        DueDate: createValues[95],
                        GLDesc: createValues[96],
                        OpenAmt: createValues[97],
                        AppliedAmt: createValues[98],
                        Discount: createValues[99],
                        TaxAmt: createValues[100],
                        TaxableAmt: createValues[101]
                    }
                ],

                transDetBC: [
                    {
                        ...basePayloads.transDetBC[0],
                        TransDetBC: createValues[102],
                        PayTo: createValues[103],
                        TransferNo: createValues[104]
                    }
                ]
            };

            const { key, num, status, json } = await apiObj.create(
                payload,
                { key: "TransHdrKey", num: "DocNum" }
            );

            expect([200, 201]).toContain(status);
            
            // Store response for next steps (contains generated IDs)
            createdRecord = json;
            TransHdrKey = key;
            DocNum = num;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Creditor Payment by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(`${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`);
            await apiObj.getByKey();
        });

        test("Get all Creditor Payment", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,OUKey,DocNum,RefNo,Source,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,GLStatusDesc,GLDesc,ChequeNo,TransferNo,CurrCode,DocAmt,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,FinalPayHdrKey,BankDueDate,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%207)&DocType=CRP`
            );
            await apiObj.getAll();
        });

        // --- STEP 3: UPDATE (POST) ---
        test("Update Creditor Payment", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed before attempting update
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            apiObj.setUrl(
                `${accUrl}/api/CP?form=%27CP%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

            // Payload Construction:
            // 1. Clone the record returned from the server (createdRecord)
            // 2. Overwrite specific fields with new values from Excel (editValues)
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                RowState: 2, // 2 = Modified State
                Remarks: editValues[0],
                
                // Update nested arrays using Object.assign to merge old data + new edits
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        Remarks: editValues[1]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        Remarks: editValues[2]
                    })
                ],
                
                // Preserve existing APAR details (no changes needed)
                glDetailsAPAR: createdRecord.glDetailsAPAR,
                
                // Ensure TransHdrKey is linked correctly in Bank Details
                transDetBC: [
                    Object.assign({}, createdRecord.transDetBC[0], {
                        TransHdrKey: keyToUse
                    })
                ]
            };

            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 4: DELETE (CLEANUP) ---
        test("Delete Creditor Payment using SQL(Clean Up)", async () => {
            // Validate key exists to prevent accidental deletion of wrong records
            expect(TransHdrKey, "TransHdrKey is not available.").toBeDefined();

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
})