/**
 * SALES INVOICE API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Sales Invoice form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Sales Invoice'
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
const sheetName = "ACCAPI_Data", formName = "Sales Invoice";
const basePayloads = AccountPayloads.SalesInvoice;
const savedKey = ID.SalesInvoice.TransHdrKey; // Fallback key
const savedDocNo = ID.SalesInvoice.num;

test.describe.serial("Sales Invoice API Test", () => {
    
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
        test("Add new Sales Invoice", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27SI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
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
                dueDate: dueDate.toISOString(),
                InvoiceDate: currentDate,
                InvNum: createValues[5],
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                RefNo: createValues[6],
                
                glDetails: [
                    {
                        ...basePayloads.glDetails[0],
                        AccKey: createValues[7],
                        AccNum: createValues[8],
                        AccDesc: createValues[9],
                        OUKey: createValues[10],
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
                        DeliveredDate: currentDate,
                        BuyerReceivedDate: currentDate
                    },
                    {
                        ...basePayloads.glDetails[2],
                        AccKey: createValues[43],
                        AccNum: createValues[44],
                        AccDesc: createValues[45],
                        OUKey: createValues[46],
                        OUCode: createValues[47],
                        Remarks: createValues[48],
                        FuncTransAmt: createValues[49],
                        LocalTransAmt: createValues[50],
                        OrigTransAmt: createValues[51],
                        TaxableTransAmt: createValues[52],
                        InclusiveTransAmt: createValues[53],
                        OrigDrAmt: createValues[54],
                        OrigCrAmt: createValues[55],
                        DetRevAmt: createValues[56],
                        CCIDKey: createValues[57],
                        CCID: createValues[58],
                        AccNumAccDesc: createValues[59],
                        CCIDCodeCCIDDesc: createValues[60],
                        AOSGLDate: currentDate,
                        rowid: createValues[61],
                        DeliveredDate: currentDate,
                        BuyerReceivedDate: currentDate
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
        test("Get Sales Invoice by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json&$expand=OTVendorData`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Sales Invoice", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?DocType=CustomSI&$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,OUKey,DocNum,Source,CCIDCodeCCIDDesc,DocType,CDTypeDesc,GLDate,FY,Period,InvNum,TaxInvNum,RemarkCode,TaxInvRemarkKey,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,ContractNo,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/Ind,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/Qty,glDetails/UOM,glDetails/TicketNo,glDetails/UnitPrice,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Sales Invoice", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27SI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );
            
            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocAmt: editValues[0],
                RowState: 2, // 2 = Modified State
                
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
                        AccNumAccDesc: editValues[11],
                        CCIDCodeCCIDDesc: editValues[12],
                        SINum: editValues[13]
                    }),
                    Object.assign({}, createdRecord.glDetails[1], {
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
                        Qty: editValues[25],
                        UnitPrice: editValues[26],
                        SINum: editValues[27]
                    }),
                    Object.assign({}, createdRecord.glDetails[2], {
                        TransHdrKey: keyToUse,
                        ClientKey: editValues[28],
                        Remarks: editValues[29],
                        FuncTransAmt: editValues[30],
                        LocalTransAmt: editValues[31],
                        OrigTransAmt: editValues[32],
                        TaxableTransAmt: editValues[33],
                        OrigDrAmt: editValues[34],
                        OrigCrAmt: editValues[35],
                        DetRevAmt: editValues[36],
                        SetupPrimaryKey: editValues[37],
                        Qty: editValues[38],
                        UnitPrice: editValues[39],
                        SINum: editValues[40]
                    })
                ]
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Sales Invoice using SQL(Clean Up)", async () => {
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