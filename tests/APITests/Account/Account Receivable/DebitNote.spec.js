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
const formName = "Debit Note";
const basePayloads = AccountPayloads.DebitNote;
const savedKey = ID.DebitNote.TransHdrKey;
const savedDocNo = ID.DebitNote.num;

test.describe.serial("Debit Note API Test", () => {
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

    test("Add new Debit Note", async ({ api }) => {
        // 1. Set URL
        const apiUrl = `${accUrl}/api/GL?form=%27DN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
        apiObj.setUrl(apiUrl);

        // 2. Build Payload
        const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
        payloadToSend.OUKey = createValues[0];
        payloadToSend.OUCode = createValues[1];
        payloadToSend.OUDesc = createValues[2];
        payloadToSend.GLDate = currentDate.toISOString();
        payloadToSend.GLDesc = createValues[3];
        payloadToSend.DocAmt = createValues[4];
        payloadToSend.DueDate = dueDate.toISOString();
        payloadToSend.InvoiceDate = currentDate.toISOString();
        payloadToSend.CreatedDate = currentDate.toISOString();
        payloadToSend.UpdatedDate = currentDate.toISOString();

        if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
            const detail1 = payloadToSend.glDetails[0];
            detail1.AccKey = createValues[5];
            detail1.AccNum = createValues[6];
            detail1.AccDesc = createValues[7];
            detail1.OUKey = createValues[8];
            detail1.OUCode = createValues[9];
            detail1.Remarks = createValues[10];
            detail1.FuncTransAmt = createValues[11];
            detail1.LocalTransAmt = createValues[12];
            detail1.OrigTransAmt = createValues[13];
            detail1.TaxableTransAmt = createValues[14];
            detail1.InclusiveTransAmt = createValues[15];
            detail1.OrigDrAmt = createValues[16];
            detail1.OrigCrAmt = createValues[17];
            detail1.DetRevAmt = createValues[18];
            detail1.CCIDKey = createValues[19];
            detail1.CCID = createValues[20];
        }

        if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
            const detail2 = payloadToSend.glDetails[1];
            detail2.AccKey = createValues[21];
            detail2.AccNum = createValues[22];
            detail2.AccDesc = createValues[23];
            detail2.OUKey = createValues[24];
            detail2.OUCode = createValues[25];
            detail2.Remarks = createValues[26];
            detail2.FuncTransAmt = createValues[27];
            detail2.LocalTransAmt = createValues[28];
            detail2.OrigTransAmt = createValues[29];
            detail2.TaxableTransAmt = createValues[30];
            detail2.InclusiveTransAmt = createValues[31];
            detail2.OrigDrAmt = createValues[32];
            detail2.OrigCrAmt = createValues[33];
            detail2.DetRevAmt = createValues[34];
            detail2.CCID = createValues[35];
            detail2.Qty = createValues[36];
            detail2.UnitPrice = createValues[37];
            detail2.AccNumAccDesc = createValues[38];
            detail2.CCIDCodeCCIDDesc = createValues[39];
            detail2.AOSGLDate = currentDate.toISOString();
            detail2.rowid = createValues[40];
            detail2.SIDate = currentDate.toISOString();
        }

        // 3. Send Request
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
    test("Get Debit Note by HdrKey", async ({ api }) => {
        const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
        );
            await apiObj.getByKey();
    });
                            
    // GET ALL
    test("Get all Debit Note", async ({ api }) => {
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,CDTypeDesc,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)&DocType=DN`
        );
        await apiObj.getAll();
    });

    // UPDATE 
    test("Update Debit Note", async ({ api }) => {
        const keyToUse = TransHdrKey || savedKey;
        const docNoToUse = DocNum || savedDocNo;
        expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
                
        apiObj.setUrl(
            `${accUrl}/api/GL?form=%27DN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
        );
                
        // Update Payload
        // copy the record from the server
        const updatePayload = JSON.parse(JSON.stringify(createdRecord));

        updatePayload.TransHdrKey = keyToUse;
        updatePayload.DocAmt = editValues[0];
        updatePayload.ReverseFromDocNum = editValues[1];
        updatePayload.RowState = 2;

        if (updatePayload.glDetails && updatePayload.glDetails[0]) {
            const detail1 = updatePayload.glDetails[0];
            detail1.TransHdrKey = keyToUse;
            detail1.Remarks = editValues[2];
            detail1.FuncTransAmt = editValues[3];
            detail1.LocalTransAmt = editValues[4];
            detail1.OrigTransAmt = editValues[5];
            detail1.TaxableTransAmt = editValues[6];
            detail1.InclusiveTransAmt = editValues[7];
            detail1.OrigDrAmt = editValues[8];
            detail1.OrigCrAmt = editValues[9];
            detail1.DetRevAmt = editValues[10];
            detail1.SetupPrimaryKey = editValues[11];
            detail1.AccNumAccDesc = editValues[12];
            detail1.CCIDCodeCCIDDesc = editValues[13];
            detail1.AdjAccNumAccDesc = editValues[14];
        }

        if (updatePayload.glDetails && updatePayload.glDetails[1]) {
            const detail2 = updatePayload.glDetails[1];
            detail2.TransHdrKey = keyToUse;
            detail2.Remarks = editValues[15];
            detail2.FuncTransAmt = editValues[16];
            detail2.LocalTransAmt = editValues[17];
            detail2.OrigTransAmt = editValues[18];
            detail2.TaxableTransAmt = editValues[19];
            detail2.InclusiveTransAmt = editValues[20];
            detail2.OrigDrAmt = editValues[21];
            detail2.OrigCrAmt = editValues[22];
            detail2.DetRevAmt = editValues[23];
            detail2.SetupPrimaryKey = editValues[24];
            detail2.Qty = editValues[25];
            detail2.UnitPrice = editValues[26];
        }
        
        // --- END OF PAYLOAD ---
                        
        const { status, json } = await apiObj.update("POST", updatePayload);
        
        expect(status).toBe(200);
    });

    test("Delete Debit Note using SQL(Clean Up)", async () => {
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
            };
    })
});