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
const formName = "Debtor Payment Receipt";
const basePayloads = AccountPayloads.DebtorPaymentReceipt;
const savedKey = ID.DebtorPaymentReceipt.TransHdrKey;
const savedDocNo = ID.DebtorPaymentReceipt.num;

test.describe.serial("Debtor Payment Receipt API Test", () => {
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

    test("Add new Debtor Payment Receipt", async ({ api }) => {
        // 1. Set URL
        const apiUrl = `${accUrl}/api/DPRecv?form=%27DPRecv%27&Environment=qaa&AttachmentID=""`;
        apiObj.setUrl(apiUrl);

        // 2. Build Payload
        const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
        payloadToSend.OUKey = createValues[0];
        payloadToSend.OUCode = createValues[1];
        payloadToSend.OUDesc = createValues[2];
        payloadToSend.GLDate = currentDate.toISOString();
        payloadToSend.GLDesc = createValues[3];
        payloadToSend.DocAmt = createValues[4];
        payloadToSend.InvoiceDate = currentDate.toISOString();
        payloadToSend.CreatedDate = currentDate.toISOString();
        payloadToSend.UpdatedDate = currentDate.toISOString();
        payloadToSend.Remarks = createValues[5];
        payloadToSend.RefNo = createValues[6];

        if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
            const detail1 = payloadToSend.glDetails[0];
            detail1.AccKey = createValues[7];
            detail1.AccNum = createValues[8];
            detail1.OUKey = createValues[9];
            detail1.Remarks = createValues[10];
            detail1.FuncTransAmt = createValues[11];
            detail1.LocalTransAmt = createValues[12];
            detail1.OrigTransAmt = createValues[13];
            detail1.TaxableTransAmt = createValues[14];
            detail1.InclusiveTransAmt = createValues[15];
            detail1.OrigDrAmt = createValues[16];
            detail1.OrigCrAmt = createValues[17];
            detail1.DetRevAmt = createValues[18];
            detail1.CCIDKey  = createValues[19];
            detail1.CCID = createValues[20];
        }

        if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
            const detail2 = payloadToSend.glDetails[1];
            detail2.AccKey = createValues[21];
            detail2.AccNum = createValues[22];
            detail2.AccDesc = createValues[23];
            detail2.OUKey = createValues[24];
            detail2.Remarks = createValues[25];
            detail2.FuncTransAmt = createValues[26];
            detail2.LocalTransAmt = createValues[27];
            detail2.OrigTransAmt = createValues[28];
            detail2.TaxableTransAmt = createValues[29];
            detail2.InclusiveTransAmt = createValues[30];
            detail2.OrigDrAmt = createValues[31];
            detail2.OrigCrAmt = createValues[32];
            detail2.DetRevAmt = createValues[33];
            detail2.CCIDKey = createValues[34];
            detail2.CCID = createValues[35];

        }

        if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[0]) {
            const detail3 = payloadToSend.glDetailsAPAR[0];
            detail3.AccKey = createValues[36];
            detail3.AccNum = createValues[37];
            detail3.OUKey = createValues[38];
            detail3.OUCode = createValues[39];
            detail3.Remarks = createValues[40];
            detail3.FuncTransAmt = createValues[41];
            detail3.LocalTransAmt = createValues[42];
            detail3.OrigTransAmt = createValues[43];
            detail3.CCIDKey = createValues[44];
            detail3.CCID = createValues[45];
            detail3.APARRefTransDetKey = createValues[46];
            detail3.APARRefTransHdrKey = createValues[47];
            detail3.DocNum = createValues[48];
            detail3.InvNum = createValues[49];
            detail3.GLDate = createValues[50];
            detail3.DueDate = createValues[51];
            detail3.GLDesc = createValues[52];
            detail3.OpenAmt = createValues[53];
            detail3.AppliedAmt = createValues[54];
            detail3.TaxableAmt = createValues[55]; 
        }

        if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[1]) {
            const detail4 = payloadToSend.glDetailsAPAR[1];
            detail4.AccKey = createValues[56];
            detail4.AccNum = createValues[57];
            detail4.OUKey = createValues[58];
            detail4.OUCode = createValues[59];
            detail4.Remarks = createValues[60];
            detail4.FuncTransAmt = createValues[61];
            detail4.LocalTransAmt = createValues[62];
            detail4.OrigTransAmt = createValues[63];
            detail4.CCID = createValues[64];
            detail4.APARRefTransDetKey = createValues[65];
            detail4.APARRefTransHdrKey = createValues[66];
            detail4.DocNum = createValues[67];
            detail4.InvNum = createValues[68];
            detail4.GLDate = createValues[69];
            detail4.DueDate = createValues[70];
            detail4.OpenAmt = createValues[71];
            detail4.AppliedAmt = createValues[72];
            detail4.TaxableAmt = createValues[73];
        }

        if (payloadToSend.TransDetBCKey && payloadToSend.TransDetBCKey[0]) {
            const detail4 = payloadToSend.TransDetBCKey[0];
            detail4.TransDetBCKey = createValues[74];
            detail4.PayTo = createValues[75];
            detail4.BenKey = createValues[76];
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
    test("Get Debtor Payment Receipt by HdrKey", async ({ api }) => {
        const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
        );
            await apiObj.getByKey();
    });
                            
    // GET ALL
    test("Get all Debtor Payment Receipt", async ({ api }) => {
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,CCIDCodeCCIDDesc%20asc,TransHdrKey&$select=TransHdrKey,OUCode,OUKey,DocNum,RefNo,Source,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=FY%20eq%202025&DocType=DRP`
        );
        await apiObj.getAll();
    });

    // UPDATE 
    test("Update Debtor Payment Receipt", async ({ api }) => {
        const keyToUse = TransHdrKey || savedKey;
        const docNoToUse = DocNum || savedDocNo;
        expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
                
        apiObj.setUrl(
            `${accUrl}/api/DPRecv?form=%27DPRecv%27&Environment=qaa&AttachmentID=""`
        );
                
        // Update Payload
        // copy the record from the server
        const updatePayload = JSON.parse(JSON.stringify(createdRecord));
        updatePayload.RowState = 2;

        if (updatePayload.glDetails && updatePayload.glDetails[0]) {
            const detail1 = updatePayload.glDetails[0];
            detail1.TransDetKey = editValues[0];
            detail1.TranHdrKey = editValues[1];
            detail1.Remarks = editValues[2];
            detail1.AccNumAccDesc = editValues[3];
            detail1.CCIDCodeCCIDDesc = editValues[4]
        }

        if (updatePayload.glDetails && updatePayload.glDetails[1]) {
            const detail2 = updatePayload.glDetails[1];
            detail2.TransHdrKey = keyToUse;
            detail2.Remarks = editValues[5]
            detail2.AccNumAccDesc = editValues[6];
            detail2.CCIDCodeCCIDDesc = editValues[7];

        }

        if (updatePayload.glDetailsAPAR && updatePayload.glDetailsAPAR[0]) {
            const detail3 = updatePayload.glDetailsAPAR[0];
            detail3.TransDetBCKey = editValues[8];
            detail3.TransDetKey = editValues[9];
            detail3.TransHdrKey = editValues[10];
            detail3.AccDesc = editValues[11];
        }
        
        if (updatePayload.glDetailsAPAR && updatePayload.glDetailsAPAR[1]) {
            const detail3 = updatePayload.glDetailsAPAR[1];
            detail3.TransDetBCKey = editValues[12];
            detail3.TransDetKey = editValues[13];
            detail3.TransHdrKey = editValues[14];
            detail3.AccDesc = editValues[15];
        }

        if (updatePayload.transDetBC && updatePayload.transDetBC[0]) {
            const detail3 = updatePayload.transDetBC[0];
            detail3.TransDetBCKey = editValues[16];
            detail3.TransHdrKey = editValues[17];
            detail3.TransferNo = editValues[18];
        }



        // --- END OF PAYLOAD ---
                        
        const { status, json } = await apiObj.update("POST", updatePayload);
        
        expect(status).toBe(200);
    });

    test("Delete Debtor Payment Receipt using SQL(Clean Up)", async () => {
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