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
const dueDate = new Date(currentDate);
dueDate.setDate(dueDate.getDate() + 30);

// Declare a variable to hold the state of the created record.
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Credit Note";
const basePayloads = AccountPayloads.CreditNote;
const savedKey = ID.CreditNote.TransHdrKey;
const savedDocNo = ID.CreditNote.num;

test.describe.serial("Credit Note API Test", () => {
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
        test("Add new Credit Note", async ({ api }) => {

            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27CN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

            const payloadToSend = JSON.parse(JSON.stringify(basePayloads));

            payloadToSend.OUCode = createValues[0];
            payloadToSend.OUDesc =  createValues[1];
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.DueDate = dueDate.toISOString();
            payloadToSend.InvoiceDate = currentDate.toISOString();
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toISOString();

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey = createValues[2];
                detail1.AccNum = createValues[3];
                detail1.AccDesc =  createValues[4];
                detail1.OUCode = createValues[5];
                detail1.Remarks = createValues[6];
                detail1.FuncTransAmt = createValues[7];
                detail1.LocalTransAmt = createValues[8];
                detail1.OrigTransAmt = createValues[9];
                detail1.OrigCrAmt = createValues[10];
                detail1.CurrKey = createValues[11];
                detail1.CCIDKey = createValues[12];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = createValues[13];
                detail2.AccNum = createValues[14];
                detail2.AccDesc = createValues[15];
                detail2.OUKey = 1;
                detail2.OUCode = createValues[16];
                detail2.Remarks = createValues[17];
                detail2.FuncTransAmt = createValues[18];
                detail2.LocalTransAmt = createValues[19];
                detail2.OrigTransAmt = createValues[20];
            }

            const { key, num, status, json } = await apiObj.create(
                payloadToSend,
                {
                    key: "TransHdrKey",
                    num: "DocNum"
                }
            );

            expect([200, 201]).toContain(status);
            createdRecord = json;
            
            TransHdrKey = key;
            DocNum = num;
        });

        // GET BY KEY
        test("Get Credit Note by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(`${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`);
            await apiObj.getByKey();
        });
            
        // GET ALL
        test("Get all Credit Note", async ({ api }) => {
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,CDTypeDesc,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=CN`
        );
            await apiObj.getAll();
        });

        // UPDATE 
        test("Update Credit Note transaction", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();

            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27CN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

            // Update Payload
            // copy the record from the server
            const updatePayload = JSON.parse(JSON.stringify(createdRecord));

            // Main Header Field
            updatePayload.TransHdrKey = keyToUse;
            updatePayload.DocNum = docNoToUse;
            updatePayload.GLDesc = "Update Credit Note"
            updatePayload.RowState = 2; 
            updatePayload.DocAmt = 2500;

            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.TransHdrKey = keyToUse;
                detail1.Remarks = "Update Credit Note";
                detail1.FuncTransAmt = -2500;
                detail1.LocalTransAmt = -2500;
                detail1.OrigTransAmt = -2500;
                detail1.TaxableTransAmt = 0;
                detail1.InclusiveTransAmt = -2;
                detail1.OrigDrAmt = 0;
                detail1.OrigCrAmt = 2500;
                detail1.DetRevAmt = 2;
            }

            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.TransHdrKey = keyToUse;
                detail2.Remarks = "Update Credit Note";
                detail2.FuncTransAmt = 2500;
                detail2.LocalTransAmt = 2500;
                detail2.OrigTransAmt = 2500.;
                detail2.TaxableTransAmt = 0;
                detail2.InclusiveTransAmt =  2500;
                detail2.OrigDrAmt = 2500;
                detail2.OrigCrAmt = 0;
                detail2.DetRevAmt = -2;
            }

            // --- END OF PAYLOAD ---
                
            const { status, json } = await apiObj.update("POST", updatePayload);
                
            expect(status).toBe(200);
        });

        test("Delete Credit Note using SQL(Clean Up)", async () => {
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
})