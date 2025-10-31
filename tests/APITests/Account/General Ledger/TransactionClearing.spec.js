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
import { describe } from "node:test";

let apiObj;
let TransHdrKey, DocNum;
let createValues, editValues;
const currentDate = new Date();
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Transaction Clearing";
const basePayloads = AccountPayloads.TransactionClearing;
const savedKey = ID.TransactionClearing.TransHdrKey;
const savedDocNo = ID.TransactionClearing.num;

test.describe.serial("Transaction Clearing API Test", () => {
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // force API mode
        // Read Excel data once
        [createValues, editValues] = await excel.loadExcelValues(
            sheetName,
            formName,
            { isUI: false }
        );
        apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
    });

    test.beforeEach(async ({ api }) => {
        // rebind fresh api context before every test
        apiObj.api = api;
    });

    test.describe("CRUD Operation Testing", () => {
        test("Add new General Journal transaction", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`
            );
            const { HdrKey, num, status, json } = await apiObj.create(
                {
                    ...basePayloads,
                    OUCode: createValues[0],
                    OUDesc: createValues[1],
                    DocNum: createValues[2],
                    GLDate: currentDate.toISOString(),
                    GLDesc: createValues[3],
                    InvoiceDate: currentDate.toISOString(),
                    CreatedDate: currentDate.toISOString(),
                    UpdatedDate: currentDate.toISOString(),
                    glDetails:[
                        {
                            AccNum: createValues[4],
                            Remarks: createValues[5],
                            FuncTransAmt: createValues[6],
                            LocalTransAmt: createValues[7],
                            OrigTransAmt: createValues[8],
                            CCID: createValues[9],
                            APARRefTransDetKey: createValues[10],
                            APARRefTransHdrKey: createValues[11],
                            DocNum: createValues[12],
                            OpenAmt: createValues[13],
                            AccNumAccDesc: createValues[14],
                            CCIDCodeCCIDDesc: createValues[15],
                        },
                        {
                            AccNum: createValues[16],
                            Remarks: createValues[17],
                            FuncTransAmt: createValues[18],
                            LocalTransAmt: createValues[19],
                            OrigTransAmt: createValues[20],
                            CCID: createValues[21],
                            APARRefTransDetKey: createValues[22],
                            APARRefTransHdrKey: createValues[23],
                            DocNum: createValues[24],
                            OpenAmt: createValues[25],
                            AccNumAccDesc: createValues[26],
                            CCIDCodeCCIDDesc: createValues[27],
                            AppliedAmt: createValues[28],
                        }
                    ]

                },
                {
                    HdrKey: "TransHdrKey",
                    num: "DocNum",
                }
            );
            expect([200, 201]).toContain(status);
            createdRecord = json;
            TransHdrKey = HdrKey;
            DocNum = num;
        });

        // GET BY KEY
         test("Get Transaction Clearing records by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
            );
                await apiObj.getByKey();
        });
        
        // GET ALL
        test("Get all Tranasaction Clearing records", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsContainAttach,IsSelect,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=CT`
            );
                await apiObj.getAll();
        });

        // UPDATE
        test("Update General Journal transaction", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
              
            apiObj.setUrl(`${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`);
        
            // --- UPDATE PAYLOAD ---
            // Use the captured 'createdRecord' to build the correct update payload.
            const updatePayload = JSON.parse(JSON.stringify(createdRecord));

            // Apply header changes
            updatePayload.TransHdrKey = keyToUse;
            updatePayload.DocNum = docNoToUse;
            updatePayload.RowState = 2;
            updatePayload.DocAmt = editValues[0];

            // Modify the first glDetails object
            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.TransHdrKey = keyToUse;
                detail1.AccKey = editValues[1];
                detail1.Remarks = editValues[2];
                detail1.FuncTransAmt = editValues[3];
                detail1.LocalTransAmt = editValues[4];
                detail1.OrigTransAmt = editValues[5];
                detail1.CCID = editValues[6];
                detail1.RefTransDetKey = editValues[7];
                detail1.RefTransHdrKey = editValues[8];
                detail1.DocNum = editValues[9];
                detail1.OpenAmt = editValues[10];
                detail1.AccNumAccDesc = editValues[11];
                detail1.CCIDCodeCCIDDesc = editValues[12];
                detail1.AppliedAmt = editValues[13];
                detail1.InvNum = editValues[14];
            }

            // Modify the second glDetails object
            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.TransHdrKey = keyToUse;
                detail2.AccKey = editValues[15]; 
                detail2.Remarks = editValues[16];
                detail2.FuncTransAmt = editValues[17];
                detail2.LocalTransAmt = editValues[18];
                detail2.OrigTransAmt = editValues[19];
                detail2.CCID = editValues[20]; 
                detail2.RefTransDetKey = editValues[21];
                detail2.RefTransHdrKey = editValues[22];
                detail2.DocNum = editValues[23];
                detail2.OpenAmt = editValues[24];
                detail2.AccNumAccDesc = editValues[25];
                detail2.CCIDCodeCCIDDesc = editValues[26];
                detail2.AppliedAmt = editValues[27];
            }

            // --- END OF PAYLOAD ---
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            
            expect(status).toBe(200);
            });

        test("Delete Transaction Clearing Record using SQL(Clean Up)", async () => {
            // Ensure we have a key from the 'create' step to delete
            expect(TransHdrKey, "TransHdrKey is not available. The 'create' test must have run successfully.").toBeDefined();
        
            console.log(`Attempting to delete record with TransHdrKey: ${TransHdrKey}`);
        
            try {
                // Call the imported function and pass the key of the record created in this test run
                await deleteBankPaymentById(TransHdrKey);
                console.log("SQL delete function executed successfully.");
            } catch (error) {
                // Fail the test if the SQL cleanup throws an error
                throw new Error(`Database cleanup failed for TransHdrKey ${TransHdrKey}. Reason: ${error.message}`);
            }
        })

    });
});