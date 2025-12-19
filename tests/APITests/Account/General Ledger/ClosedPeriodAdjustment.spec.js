/**
 * CLOSED PERIOD ADJUSTMENT API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Closed Period Adjustment form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Closed Period Adjustment'
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
const sheetName = "ACCAPI_Data", formName = "Closed Period Adjustment";
const basePayloads = AccountPayloads.ClosedPeriodAdjustment;
const savedKey = ID.ClosedPeriodAdjustment.TransHdrKey; // Fallback key
const savedDocNo = ID.ClosedPeriodAdjustment.num;

test.describe.serial("Closed Period Adjustment API Test", () => {
    
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
        test("Add new Close Period Adjustment", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27AJ%27&Environment=qaa&AttachmentID=""`;
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
                GLDesc: createValues[3],
                DocAmt: createValues[4],
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                
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
                        CCID: createValues[20],
                        AccNumAccDesc: createValues[21],
                        CCIDCodeCCIDDesc: createValues[22],
                        rowid: createValues[23],
                    },
                    {
                        ...basePayloads.glDetails[1],
                        AccKey: createValues[24],
                        AccNum: createValues[25],
                        AccDesc: createValues[26],
                        OUKey: createValues[27],
                        OUCode: createValues[28],
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
                        AccNumAccDesc: createValues[40],
                        CCIDCodeCCIDDesc: createValues[41],
                        rowid: createValues[42],
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
        test("Get Closed Period Adjustment by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Closed Period Adjustment", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsContainAttach,IsSelect,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=FY%20eq%202025&DocType=AJ`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Closed Period Adjustment", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27AJ%27&Environment=qaa&AttachmentID=""`
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
                        Remarks: editValues[1],
                        FuncTransAmt: editValues[2],
                        LocalTransAmt: editValues[3],
                        OrigTransAmt: editValues[4],
                        TaxableTransAmt: editValues[5],
                        InclusiveTransAmt: editValues[6],
                        OrigDrAmt: editValues[7],
                        OrigCrAmt: editValues[8],
                        DetRevAmt: editValues[9],
                        SetupPrimaryKey: editValues[10],
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
                        TransHdrKey: keyToUse,
                        Remarks: editValues[11],
                        FuncTransAmt: editValues[12],
                        LocalTransAmt: editValues[13],
                        OrigTransAmt: editValues[14],
                        TaxableTransAmt: editValues[15],
                        InclusiveTransAmt: editValues[16],
                        OrigDrAmt: editValues[17],
                        OrigCrAmt: editValues[18],
                        DetRevAmt: editValues[19],
                        SetupPrimaryKey: editValues[20],
                    })
                ]
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Closed Period Adjustment using SQL(Clean Up)", async () => {
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