/**
 * PURCHASE INVOICE API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Purchase Invoice form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Purchase Invoice'
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
const sheetName = "ACCAPI_Data", formName = "Purchase Invoice";
const basePayloads = AccountPayloads.PurchaseInvoice;
const savedKey = ID.PurchaseInvoice.TransHdrKey; // Fallback key
const savedDocNo = ID.PurchaseInvoice.num;

test.describe.serial("Purchase Invoice API Test", () => {
    
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
        test("Add Purchase Invoice", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27PI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
            apiObj.setUrl(apiUrl);

            // Dynamic Dates
            const currentDate = new Date().toISOString();
            const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 30);

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
                DueDate: dueDate.toISOString(),
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                
                // Map General Ledger Details (Array of 3 items)
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[5],
                        AccNum: createValues[6],
                        AccDesc: createValues[7],
                        OUKey: createValues[8],
                        OUCode: createValues[9],
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
                        CCIDKey: createValues[33],
                        CCID: createValues[34],
                        Qty: createValues[35],
                        UnitPrice: createValues[36],
                        AccNumAccDesc: createValues[37],
                        CCIDCodeCCIDDesc: createValues[38],
                        AOSGLDate: currentDate,
                        rowid: createValues[39],
                        SIDate: currentDate
                    },
                    {
                        ...basePayloads.glDetails[2],
                        AccKey: createValues[40],
                        AccNum: createValues[41],
                        AccDesc: createValues[42],
                        OUKey: createValues[43],
                        OUCode: createValues[44],
                        Remarks: createValues[45],
                        FuncTransAmt: createValues[46],
                        LocalTransAmt: createValues[47],
                        TaxableTransAmt: createValues[48],
                        InclusiveTransAmt: createValues[49],
                        OrigDrAmt: createValues[50],
                        OrigCrAmt: createValues[51],
                        DetRevAmt: createValues[52],
                        CCIDKey: createValues[53],
                        CCID: createValues[54],
                        Qty: createValues[55],
                        UnitPrice: createValues[56],
                        AccNumAccDesc: createValues[57],
                        CCIDCodeCCIDDesc: createValues[58],
                        AOSGLDate: currentDate,
                        rowid: createValues[59],
                        SIDate: currentDate
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
        test("Get Purchase Invoice by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json&$expand=OTVendorData`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Purchase Invoice", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUKey,OUCode,DocNum,Source,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,InvoiceDate,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,CreatedDate,UpdatedByCode,UpdatedDate,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,LastApprovedDate,VoidByCode,VoidDate,IsSelect,IsContainGRNI,FinalPayHdrKey,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/Ind,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/Qty,glDetails/UOM,glDetails/UnitPrice,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%207)&DocType=PI`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Purchase Invoice", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
                
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27PI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );
                
            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                DocAmt: editValues[0],
                PayTermKey: editValues[1],
                RowState: editValues[2],
                
                // Update specific rows in the glDetails array
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
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
                        ItemCatCode: editValues[13],
                        AccNumAccDesc: editValues[14],
                        CCIDCodeCCIDDesc: editValues[15],
                        AdjAccNumAccDesc: editValues[16],
                        SINum: editValues[17]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        Remarks: editValues[18],
                        FuncTransAmt: editValues[19],
                        LocalTransAmt: editValues[20],
                        OrigTransAmt: editValues[21],
                        TaxableTransAmt: editValues[22],
                        InclusiveTransAmt: editValues[23],
                        OrigDrAmt: editValues[24],
                        OrigCrAmt: editValues[25],
                        DetRevAmt: editValues[26],
                        SetupPrimaryKey: editValues[27],
                        Qty: editValues[28],
                        UnitPrice: editValues[29],
                        ItemCatCode: editValues[30],
                        AdjAccNumAccDesc: editValues[31],
                        SINum: editValues[32]
                    }),
                    Object.assign({}, createdRecord.glDetails[2], {
                        TransHdrKey: keyToUse,
                        Remarks: editValues[33],
                        FuncTransAmt: editValues[34],
                        LocalTransAmt: editValues[35],
                        OrigTransAmt: editValues[36],
                        TaxableTransAmt: editValues[37],
                        InclusiveTransAmt: editValues[38],
                        OrigDrAmt: editValues[39],
                        OrigCrAmt: editValues[40],
                        DetRevAmt: editValues[41],
                        SetupPrimaryKey: editValues[42],
                        Qty: editValues[43],
                        UnitPrice: editValues[44],
                        ItemCatCode: editValues[45],
                        SINum: editValues[46]
                    })
                ]
            };
                                
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Purchase Invoice using SQL(Clean Up)", async () => {
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
})