/**
 * DEBIT NOTE API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Debit Note form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Debit Note'
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
const sheetName = "ACCAPI_Data", formName = "Debit Note";
const basePayloads = AccountPayloads.DebitNote;
const savedKey = ID.DebitNote.TransHdrKey; // Fallback key
const savedDocNo = ID.DebitNote.num;

test.describe.serial("Debit Note API Test", () => {
    
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
        test("Add new Debit Note", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27DN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
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
                GLDesc: createValues[3],
                DocAmt: createValues[4],
                GLDate: currentDate,
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                DueDate: dueDate.toISOString(),
                
                // Map General Ledger Details (Array of 2 items)
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
                        OUCode: createValues[25],
                        Remarks: createValues[26],
                        FuncTransAmt: createValues[27],
                        LocalTransAmt: createValues[28],
                        OrigTransAmt: createValues[29],
                        TaxableTransAmt: createValues[30],
                        InclusiveTransAmt: createValues[31],
                        OrigDrAmt: createValues[32],
                        OrigCrAmt: createValues[33],
                        DetRevAmt: createValues[34],
                        CCID: createValues[35],
                        Qty: createValues[36],
                        UnitPrice: createValues[37],
                        AccNumAccDesc: createValues[38],
                        CCIDCodeCCIDDesc: createValues[39],
                        rowid: createValues[40],
                        AOSGLDate: currentDate,
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
        test("Get Debit Note by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Debit Note", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,CDTypeDesc,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)&DocType=DN`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Debit Note", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27DN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );
            
            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocAmt: editValues[0],
                ReverseFromDocNum: editValues[1],
                RowState: 2, // 2 = Modified State
                
                // Update specific rows in the glDetails array
                glDetails: [
                    Object.assign({}, createdRecord.glDetails[0], {
                        TransHdrKey: keyToUse,
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
                        AccNumAccDesc: editValues[12],
                        CCIDCodeCCIDDesc: editValues[13],
                        AdjAccNumAccDesc: editValues[14]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
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
                        Qty: editValues[25],
                        UnitPrice: editValues[26]
                    })
                ]
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Debit Note using SQL(Clean Up)", async () => {
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