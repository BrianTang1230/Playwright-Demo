/**
 * ACCOUNT MIGRATION JOURNAL API AUTOMATION TEST
 * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Account Migration Journal'
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

// Global variables
let apiObj, createValues, editValues;
let TransHdrKey, DocNum, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Account Migration Journal";
const basePayloads = AccountPayloads.AccountMigrationJournal;
const savedKey = ID.AccountMigrationJournal.TransHdrKey;
const savedDocNo = ID.AccountMigrationJournal.num;

test.describe.serial("Account Migration Journal API Test", () => {
    
    // --- SETUP ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // Force API mode
        [createValues, editValues] = await excel.loadExcelValues(
            sheetName,
            formName,
            { isUI: false }
        );
        apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
    });

    test.beforeEach(async ({ api }) => {
        apiObj.api = api;
    });

    test.describe("CRUD Operation Testing", () => {
        
        // --- STEP 1: CREATE (POST) ---
        test("Add new Account Migration Journal", async ({ api }) => {
            // Form = DM (Account Migration Journal)
            const apiUrl = `${accUrl}/api/GL?form=%27DM%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            const currentDate = new Date().toISOString();

            // Build Payload
            const payloadToSend = {
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
                
                glDetails: [
                    {
                        ...basePayloads.glDetails?.[0],
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
                        Qty: createValues[21],
                        UnitPrice: createValues[22],
                        AccNumAccDesc: createValues[23],
                        CCIDCodeCCIDDesc: createValues[24],
                        rowid: createValues[25]
                    },
                    {
                        ...basePayloads.glDetails?.[1],
                        AccKey: createValues[26],
                        AccNum: createValues[27],
                        AccDesc: createValues[28],
                        OUKey: createValues[29],
                        OUCode: createValues[30],
                        Remarks: createValues[31],
                        FuncTransAmt: createValues[32],
                        LocalTransAmt: createValues[33],
                        OrigTransAmt: createValues[34],
                        TaxableTransAmt: createValues[35],
                        InclusiveTransAmt: createValues[36],
                        OrigDrAmt: createValues[37],
                        OrigCrAmt: createValues[38],
                        DetRevAmt: createValues[39],
                        CCIDKey: createValues[40],
                        CCID: createValues[41],
                        Qty: createValues[42],
                        AccNumAccDesc: createValues[43],
                        CCIDCodeCCIDDesc: createValues[44],
                        rowid: createValues[45]
                    }
                ]
            };

            const { key, num, status, json } = await apiObj.create(
                payloadToSend,
                { key: "TransHdrKey", num: "DocNum" }
            );

            expect([200, 201]).toContain(status);
            
            createdRecord = json;
            TransHdrKey = key;
            DocNum = num;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Account Migration Journal by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Account Migration Journal", async ({ api }) => {
            // Note: Fixed DocType from CN to DM
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,CDTypeDesc,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=DM`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Account Migration Journal", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            // Note: Fixed form from CN to DM
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27DM%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

            // Construct Update Payload
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                DocAmt: editValues[0],
                RowState: 2, // Modified State

                // Update Details using Object.assign
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
                        Qty: editValues[12]
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
                        Qty: editValues[24]
                    })
                ]
            };
                
            const { status } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Account Migration Journal using SQL(Clean Up)", async () => {
            expect(TransHdrKey, "TransHdrKey is not available.").toBeDefined();
        
            console.log(`Attempting to delete record with TransHdrKey: ${TransHdrKey}`);
        
            try {
                await deleteBankPaymentById(TransHdrKey);
                console.log("SQL delete function executed successfully.");
            } catch (error) {
                throw new Error(`Database cleanup failed for TransHdrKey ${TransHdrKey}. Reason: ${error.message}`);
            }
        });
    });
});