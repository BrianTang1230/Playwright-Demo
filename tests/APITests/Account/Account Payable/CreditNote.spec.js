/**
 * CREDIT NOTE API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Credit Note form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Credit Note'
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
const sheetName = "ACCAPI_Data", formName = "Credit Note";
const basePayloads = AccountPayloads.CreditNote;
const savedKey = ID.CreditNote.TransHdrKey; // Fallback key if creation fails
const savedDocNo = ID.CreditNote.num;

test.describe.serial("Credit Note API Test", () => {
    
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
        test("Add new Credit Note", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27CN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
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
                GLDate: currentDate,
                GLDesc: createValues[3],
                DOcAmt: createValues[4],
                DueDate: dueDate.toISOString(),
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                RefNo: createValues[5],
                
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[6],
                        AccNum: createValues[7],
                        AccDesc: createValues[8],
                        OUKey: createValues[9],
                        OUCode: createValues[10],
                        Remarks: createValues[11],
                        FuncTransAmt: createValues[12],
                        LocalTransAmt: createValues[13],
                        OrigTransAmt: createValues[14],
                        TaxableTransAmt: createValues[15],
                        InclusiveTransAmt: createValues[16],
                        OrigDrAmt: createValues[17],
                        OrigCrAmt: createValues[18],
                        DetRevAmt: createValues[19],
                        CCIDKey: createValues[20],
                        CCID: createValues[21]
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[22],
                        AccNum: createValues[23],
                        AccDesc: createValues[24],
                        OUKey: createValues[25],
                        OUCode: createValues[26],
                        Remarks: createValues[27],
                        FuncTransAmt: createValues[28],
                        LocalTransAmt: createValues[29],
                        OrigTransAmt: createValues[30],
                        TaxableTransAmt: createValues[31],
                        InclusiveTransAmt: createValues[32],
                        OrigDrAmt: createValues[33],
                        OrigCrAmt: createValues[34],
                        DetRevAmt: createValues[35],
                        CCIDKey: createValues[36],
                        CCID: createValues[37],
                        Qty: createValues[38],
                        UnitPrice: createValues[39],
                        AccNumAccDesc: createValues[40],
                        CCIDCodeCCIDDesc: createValues[41],
                        AOSGLDate: currentDate,
                        rowid: createValues[42],
                        SIDate: currentDate
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
        test("Get Credit Note by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(`${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`);
            await apiObj.getByKey();
        });

        test("Get all Credit Note", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,CDTypeDesc,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=CN`
            );
            await apiObj.getAll();
        });

        // --- STEP 3: UPDATE (POST) ---
        test("Update Credit Note transaction", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed before attempting update
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27CN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

            // Payload Construction:
            // 1. Clone the record returned from the server (createdRecord)
            // 2. Overwrite specific fields with new values from Excel (editValues)
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                RowState: 2, // 2 = Modified State
                GLDesc: editValues[0],
                DocAmt: editValues[1],
                
                // Update nested arrays using Object.assign to merge old data + new edits
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
                        SetupPrimaryKey: editValues[12]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[13],
                        Remarks: editValues[14],
                        FuncTransAmt: editValues[15],
                        LocalTransAmt: editValues[16],
                        OrigTransAmt: editValues[17],
                        TaxableTransAmt: editValues[18],
                        InclusiveTransAmt: editValues[19],
                        OrigDrAmt: editValues[20],
                        OrigCrAmt: editValues[21],
                        DetRevAmt: editValues[22],
                        SetupPrimaryKey: editValues[23],
                        Qty: editValues[24],
                        UnitPrice: editValues[25]
                    })
                ]
            };

            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 4: DELETE (CLEANUP) ---
        test("Delete Credit Note using SQL(Clean Up)", async () => {
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