/**
 * GENERAL JOURNAL API AUTOMATION TEST
 * Purpose: Validates the CRUD lifecycle.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'General Journal'
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

// Global variables to maintain state
let apiObj, createValues, editValues, TransHdrKey, DocNum, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "General Journal";
const basePayloads = AccountPayloads.GeneralJournal;
const savedKey = ID.GeneralJournal.TransHdrKey;
const savedDocNo = ID.GeneralJournal.num;

test.describe.serial("General Journal API Test", () => {
    
    // --- SETUP ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false);
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
        
        // --- STEP 1: CREATE (SPLIT STRATEGY) ---
        test("Add new General Journal transaction", async ({ api }) => {
            const apiUrl = `${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            const currentDate = new Date().toISOString();

            // --- PART A: CREATE HEADER ONLY ---
            const payload = {
                ...basePayloads,
                OUKey: createValues[0],
                OUCode: createValues[1],
                OUDesc: createValues[2],
                GLDate: currentDate,
                GLDesc: createValues[3],
                InvoiceDate: currentDate,
                CreatedDate: currentDate,
                UpdatedDate: currentDate,

                glDetails: [
                  {
                    ...basePayloads.glDetails[0],
                    AccKey: createValues[4],
                    AccNum: createValues[5],
                    AccDesc: createValues[6],
                    OUKey: createValues[7],
                    OUCode: createValues[8],
                    Remarks: createValues[9],
                    FuncTransAmt: createValues[10],
                    LocalTransAmt: createValues[11],
                    OrigTransAmt: createValues[12],
                    TaxableTransAmt: createValues[13],
                    InclusiveTransAmt: createValues[14],
                    OrigDrAmt: createValues[15],
                    OrigCrAmt: createValues[16],
                    DetRevAmt: createValues[17],
                    CCIDKey: createValues[18],
                    CCID: createValues[19],
                    Qty: createValues[20],
                    AccNumAccDesc: createValues[21],
                    CCIDCodeCCIDDsec: createValues[22],
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
                    Qty: createValues[40],
                    AccNumAccDesc: createValues[41],
                    CCIDCodeCCIDDesc: createValues[42],
                    rowid: createValues[43],
                  }
                ]
              };

            const { HdrKey, num, status, json } = await apiObj.create(
                payload,
                { HdrKey: "TransHdrKey", num: "DocNum" }
            );
            
            expect([200, 201]).toContain(status);
            
            // Capture Keys
            TransHdrKey = HdrKey;
            DocNum = num;
            createdRecord = json;
        });

        // --- STEP 2: READ (GET) ---
        test("Get General Journal transaction by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all General Journal transactions", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=GJ`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update General Journal transaction", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;

            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`
            );

            // Payload Construction using Object.assign pattern from your example
            const updatePayload = {
                ...createdRecord,
                TransHdrKey: keyToUse,
                DocNum: docNoToUse,
                DocAmt: editValues[0],
                RowState: 2, // Modified Header

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
                      ClientKey: editValues[13],
                      FuncTransAmt: editValues[14],
                      LocalTransAmt: editValues[15],
                      OrigTransAmt: editValues[16],
                      TaxableTransAmt: editValues[17],
                      InclusiveTransAmt: editValues[18],
                      OrigDrAmt: editValues[19],
                      OrigCrAmt: editValues[20],
                      DetRevAmt: editValues[21],
                      SetupPrimaryKey: editValues[22],
                      Qty: editValues[23],
                    })
                ]
            };

            const { status } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete General Journal Transaction using SQL(Clean Up)", async () => {
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