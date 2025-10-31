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

let apiObj;
let createValues, editValues;
let TransHdrKey, DocNum;
const currentDate = new Date();

// Declare a variable to hold the state of the created record.
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Bank Receipt";
const basePayloads = AccountPayloads.BankReceipt;
const savedKey = ID.BankReceipt.TransHdrKey;
const savedDocNo = ID.BankReceipt.num;

test.describe.serial("Bank Receipt API Test", () => {
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
            test("Add new Bank Receipt", async ({ api }) => {
                apiObj.setUrl(
                    `${accUrl}/api/GL?form=%27BR%27&Environment=qaa&AttachmentID=""`
                );

            const payloadToSend = JSON.parse(JSON.stringify(basePayloads));

            payloadToSend.OUCode = "UMBB";
            payloadToSend.OUDesc = "UNITED MALACCA BERHAD";
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.GLDesc = "Test Receipt";
            payloadToSend.DocAmt = 1000;
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toDateString();
            payloadToSend.Remarks = "Test Receipt";
            payloadToSend.RefNo = "12345";

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey = 3427;
                detail1.AccNum = "15233210";
                detail1.AccDesc = "PETTY CASH - M.TANAH";
                detail1.OUCode = "UMBB";
                detail1.Remarks = "Test Receipt";
                detail1.FuncTransAmt = 1000;
                detail1.LocalTransAmt = 1000;
                detail1.OrigTransAmt = 1000;
                detail1.TaxableTransAmt =  0;
                detail1.InclusiveTransAmt = 1000;
                detail1.OrigDrAmt =  1000;
                detail1.OrigCrAmt =  0;
                detail1.DetRevAmt =  -1000;
                detail1.CCIDKey = 10630;
                detail1.SetupPrimaryKey = 115;
                detail1.CCID = "PCEUMB01";
                detail1.AccNumAccDesc = "15233210 - ESTATE PETTY CASH PEN";
                detail1.CCIDCodeCCIDDesc = "PCEUMB01 - PETTY CASH - M.TANAH";
                detail1.InvoiceDate = currentDate.toISOString();
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = 3281;
                detail2.AccNum = "12921010";
                detail2.AccDesc = "DEPOSITS (GENERAL)";
                detail2.OUCode = "UMBB";
                detail2.Remarks = "Test Receipt";
                detail2.FuncTransAmt = -1000;
                detail2.LocalTransAmt = -1000;
                detail2.OrigTransAmt = -1000;
                detail2.TaxableTransAmt = 0.0;
                detail2.InclusiveTransAmt = -1000;
                detail2.OrigDrAmt = 0;
                detail2.OrigCrAmt = 1000;
                detail2.DetRevAmt = 1000;
                detail2.CCIDKey = 225;
                detail2.SetupPrimaryKey = 154;
                detail2.CCID = "ODHDPO999";
                detail2.AccNumAccDesc = "12921010 - DEPOSITS (GENERAL)";
                detail2.CCIDCodeCCIDDesc = "ODHDPO999 - DEPOSIT - OTHERS";
                detail2.InvoiceDate = currentDate.toISOString();
            }

            if (payloadToSend.glDetails && payloadToSend.transDetBC[0]) {
                const detail3 = payloadToSend.transDetBC[0];
                detail3.PayTo = "BANGUNAN KWSP K.K";
            }

                const { HdrKey, num, status, json } = await apiObj.create(
                    payloadToSend,
                    {
                        HdrKey: "TransHdrKey",
                        num: "DocNum"
                    }
                );

                expect([200, 201]).toContain(status);
                createdRecord = json;
                
                TransHdrKey = HdrKey;
                DocNum = num;
            });

            // GET BY KEY
            test("Get Bank Receipt by HdrKey", async ({ api }) => {
                const keyToUse = TransHdrKey || savedKey;
                apiObj.setUrl(`${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`);
                await apiObj.getByKey();
            });
            
            // GET ALL
            test("Get all Bank Receipt", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,ChequeNo,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=BR`
            );
                await apiObj.getAll();
            });

            // UPDATE
            test("Update Bank Receipt", async ({ api }) => {
                const keyToUse = TransHdrKey || savedKey;
                const docNoToUse = DocNum || savedDocNo;
                expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
                  
                apiObj.setUrl(`${accUrl}/api/GL?form=%27BR%27&Environment=qaa&AttachmentID=""`);
            
                // --- UPDATE PAYLOAD  ---

                // Use the captured 'createdRecord' to build the correct update payload.
                const updatePayload = JSON.parse(JSON.stringify(createdRecord));

                // Apply changes to the main header fields.
                updatePayload.TransHdrKey = keyToUse;
                updatePayload.DocNum = docNoToUse;
                updatePayload.GLDesc = "Update Test";
                updatePayload.DocAmt = 2000;
                updatePayload.RowState = 2; 
                updatePayload.Remarks = "Update Test";

                // Modify the *second* object inside the glDetails array.
                if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                    const detail2 = updatePayload.glDetails[1];
                    detail2.TransHdrKey = keyToUse;
                    detail2.Remarks = "Update Test";
                    detail2.FuncTransAmt = -2000;
                    detail2.LocalTransAmt = -2000;
                    detail2.InclusiveTransAmt = -2000;
                    detail2.OrigCrAmt = 2000;
                    detail2.Qty = 2;
                }


                if (updatePayload.transDetBC && updatePayload.transDetBC[0]){
                    const detail3 = updatePayload.transDetBC[0];
                    detail3.TransHdrKey = keyToUse;
                }
                
                // --- END OF PAYLOAD ---
                
                const { status, json } = await apiObj.update("POST", updatePayload);
                
                expect(status).toBe(200);
            });

            test("Delete Bank Receipt using SQL(Clean Up)", async () => {
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
            });
    });
})