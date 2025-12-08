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
import { create } from "domain";

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
const formName = "Creditor Payment";
const basePayloads = AccountPayloads.CreditorPayment;
const savedKey = ID.CreditorPayment.TransHdrKey;
const savedDocNo = ID.CreditorPayment.num;

test.describe.serial("Creditor Payment API Test", () => {
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
        test("Add new Creditor Payment", async ({ api }) => {

            apiObj.setUrl(
                `${accUrl}/api/CP?form=%27CP%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

            const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
            payloadToSend.OUKey = createValues[0];
            payloadToSend.OUCode = createValues[1];
            payloadToSend.OUDesc = createValues[2];
            payloadToSend.DocNum = createValues[3];
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.GLDesc = createValues[4];
            payloadToSend.DocAmt = createValues[5];
            payloadToSend.InvoiceDate = currentDate.toISOString();
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toISOString();
            payloadToSend.Remarks = createValues[6];
            payloadToSend.RefNo = createValues[7];
            payloadToSend.BankDueDate = dueDate.toISOString();

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey = createValues[8];
                detail1.AccNum = createValues[9];
                detail1.AccDesc = createValues[10];
                detail1.OUKey = createValues[11];
                detail1.Remarks = createValues[12];
                detail1.FuncTransAmt = createValues[13];
                detail1.LocalTransAmt = createValues[14];
                detail1.OrigTransAmt = createValues[15];
                detail1.TaxableTransAmt = createValues[16];
                detail1.InclusiveTransAmt = createValues[17];
                detail1.OrigDrAmt = createValues[18];
                detail1.OrigCrAmt = createValues[19];
                detail1.DetRevAmt = createValues[20];
                detail1.CCIDKey = createValues[21]; 
                detail1.CCID = createValues[22];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = createValues[23];
                detail2.AccNum = createValues[24];
                detail2.OUKey = createValues[25];
                detail2.Remarks = createValues[26];
                detail2.FuncTransAmt = createValues[27];
                detail2.LocalTransAmt = createValues[28];
                detail2.OrigTransAmt = createValues[29];
                detail2.TaxableTransAmt = createValues[30];
                detail2.InclusiveTransAmt = createValues[31];
                detail2.OrigDrAmt = createValues[32];
                detail2.OrigCrAmt = createValues[33];
                detail2.DetRevAmt = createValues[34];
                detail2.CCIDKey = createValues[35];
                detail2.CCID = createValues[36];
            }

            if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[0]) {
                const detail3 = payloadToSend.glDetailsAPAR[0];
                detail3.AccKey = createValues[37];
                detail3.AccNum = createValues[38];
                detail3.OUKey = createValues[39];
                detail3.OUCode = createValues[40];
                detail3.Remarks = createValues[41];
                detail3.FuncTransAmt = createValues[42];
                detail3.LocalTransAmt = createValues[43];
                detail3.OrigTransAmt = createValues[44];
                detail3.CCIDKey = createValues[45];
                detail3.CCID = createValues[46];
                detail3.APARRefTransDetKey = createValues[47];
                detail3.APARRefTransHdrKey = createValues[48];
                detail3.DocNum = createValues[49];
                detail3.GLDate = createValues[50];
                detail3.DueDate = createValues[51];
                detail3.GLDesc = createValues[52];
                detail3.OpenAmt = createValues[53];
                detail3.AppliedAmt = createValues[54];
                detail3.Discount = createValues[55];
                detail3.TaxAmt = createValues[56];
                detail3.TaxableAmt = createValues[57];
            }

            if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[1]) {
                const detail4 = payloadToSend.glDetailsAPAR[1];
                detail4.AccKey = createValues[58];
                detail4.AccNum = createValues[59];
                detail4.OUKey = createValues[60];
                detail4.OUCode = createValues[61];
                detail4.Remarks = createValues[62];
                detail4.FuncTransAmt = createValues[63];
                detail4.LocalTransAmt = createValues[64];
                detail4.OrigTransAmt = createValues[65];
                detail4.CCID = createValues[66];
                detail4.CCID = createValues[67];
                detail4.APARRefTransDetKey = createValues[68];
                detail4.APARRefTransHdrKey = createValues[69];
                detail4.DocNum = createValues[70];
                detail4.InvNum = createValues[71];
                detail4.GLDate = createValues[72];
                detail4.DueDate = createValues[73];
                detail4.GLDesc = createValues[74];
                detail4.OpenAmt = createValues[75];
                detail4.AppliedAmt = createValues[76];
                detail4.Discount = createValues[77];
                detail4.TaxAmt = createValues[78];
                detail4.TaxableAmt = createValues[79];
            }

                if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[2]) {
                const detail5 = payloadToSend.glDetailsAPAR[2];
                detail5.AccKey = createValues[80];
                detail5.AccNum = createValues[81];
                detail5.OUKey = createValues[82];
                detail5.OUCode = createValues[83];
                detail5.Remarks = createValues[84];
                detail5.FuncTransAmt = createValues[85];
                detail5.LocalTransAmt = createValues[86];
                detail5.OrigTransAmt = createValues[87];
                detail5.CCID = createValues[88];
                detail5.CCID = createValues[89];
                detail5.APARRefTransDetKey = createValues[90];
                detail5.APARRefTransHdrKey = createValues[91];
                detail5.DocNum = createValues[92];
                detail5.InvNum = createValues[93];
                detail5.GLDate = createValues[94];
                detail5.DueDate = createValues[95];
                detail5.GLDesc = createValues[96];
                detail5.OpenAmt = createValues[97];
                detail5.AppliedAmt = createValues[98];
                detail5.Discount = createValues[99];
                detail5.TaxAmt = createValues[100];
                detail5.TaxableAmt = createValues[101];
            }

            if (payloadToSend.transDetBC && payloadToSend.transDetBC[0]) {
                const detail6 = payloadToSend.transDetBC[0];
                detail6.TransDetBC = createValues[102];
                detail6.PayTo = createValues[103];
                detail6.TransferNo = createValues[104];
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
        test("Get Creditor Payment by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(`${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`);
            await apiObj.getByKey();
        });
                    
        // GET ALL
        test("Get all Creditor Payment", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,OUKey,DocNum,RefNo,Source,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,GLStatusDesc,GLDesc,ChequeNo,TransferNo,CurrCode,DocAmt,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,FinalPayHdrKey,BankDueDate,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%207)&DocType=CRP`
            );
                await apiObj.getAll();
        });

        // UPDATE 
        test("Update Creditor Payment", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
        
            apiObj.setUrl(
                `${accUrl}/api/CP?form=%27CP%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );
        
            // Update Payload
            // copy the record from the server
            const updatePayload = JSON.parse(JSON.stringify(createdRecord));
        
            // Main Header Field
            updatePayload.TransHdrKey = keyToUse;
            updatePayload.DocNum = docNoToUse;
            updatePayload.RowState = 2;
            updatePayload.Remarks = editValues[0];

            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.Remarks = editValues[1];
            }

            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.Remarks = editValues[2];
            }
            
            if (updatePayload.transDetBC && updatePayload.transDetBC[0]) {
                const detail6 = updatePayload.transDetBC[0];
                detail6.TransHdrKey = keyToUse;
            }
            // --- END OF PAYLOAD ---
                        
            const { status, json } = await apiObj.update("POST", updatePayload);
                        
            expect(status).toBe(200);
        });

        test("Delete Creditor Payment using SQL(Clean Up)", async () => {
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