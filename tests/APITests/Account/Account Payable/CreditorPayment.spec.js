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
            payloadToSend.OUCode = createValues[0];
            payloadToSend.OUDesc = createValues[1];
            payloadToSend.DocNum = createValues[2];
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.GLDescription = createValues[3];
            payloadToSend.DocAmt = createValues[4];
            payloadToSend.InvoiceDate = currentDate.toISOString();
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toISOString();
            payloadToSend.Remarks = createValues[5];

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey=  createValues[6];
                detail1.AccNum = createValues[7];
                detail1.Remarks = createValues[8];
                detail1.FuncTransAmt = createValues[9];
                detail1.OrigTransAmt = createValues[10];
                detail1.OrigDrAmt = createValues[11];
                detail1.CCIDKey = createValues[12];
                detail1.CCID = createValues[13];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = createValues[14];
                detail2.AccNum = createValues[15];
                detail2.AccDesc = createValues[16];
                detail2.Remarks = createValues[17];
                detail2.FuncTransAmt = createValues[18];
                detail2.LocalTransAmt = createValues[19];
                detail2.OrigTransAmt = createValues[20];
                detail2.OrigCrAmt = createValues[21];
                detail2.CCIDKey = createValues[22];
                detail2.CCID = createValues[23];
            }

            if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[0]) {
                const detail3 = payloadToSend.glDetailsAPAR[0];
                detail3.Acckey = createValues[24];
                detail3.AccNum = createValues[25];
                detail3.OUCode = createValues[26];
                detail3.Remarks = createValues[27];
                detail3.FuncTransAmt = createValues[28];
                detail3.LocalTransAmt = createValues[29];
                detail3.OrigTransAmt = createValues[30];
                detail3.CCIDKey = createValues[31];
                detail3.APARRefTransDetKey = createValues[32];
                detail3.APARRefTransHdrKey = createValues[33];
                detail3.CCID = createValues[34];
                detail3.GLDate = createValues[35];
                detail3.GLDesc = createValues[36];
                detail3.OpenAmt = createValues[37];
                detail3.AppliedAmt = createValues[38];
            }

            if (payloadToSend.glDetailsAPAR && payloadToSend.glDetailsAPAR[1]) {
                const detail3 = payloadToSend.glDetailsAPAR[1];
                detail3.Acckey = createValues[39];
                detail3.AccNum = createValues[40];
                detail3.OUCode = createValues[41];
                detail3.Remarks = createValues[42];
                detail3.FuncTransAmt = createValues[43];
                detail3.LocalTransAmt = createValues[44];
                detail3.OrigTransAmt = createValues[45];
                detail3.CCIDKey = createValues[46];
                detail3.APARRefTransDetKey = createValues[47];
                detail3.APARRefTransHdrKey = createValues[48];
                detail3.CCID = createValues[49];
                detail3.DocNum = createValues[50];
                detail3.GLDate = createValues[51];
                detail3.GLDesc = createValues[52];
                detail3.OpenAmt = createValues[53];
                detail3.AppliedAmt = createValues[54];
                detail3.TaxableAmt = createValues[55];
            }

            if (payloadToSend.transDetBC && payloadToSend.transDetBC[0]) {
                const detail4 = payloadToSend.transDetBC[0];
                detail4.TransDetBCKey = createValues[56];
                detail4.PayTo = createValues[57];
                detail4.TransferNo = createValues[58];
                detail4.BenKey = createValues[59];
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
            updatePayload.DocAmt = editValues[0];
            updatePayload.Remarks = editValues[1];
            updatePayload.RowState = 2;

            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.TransDetKey = editValues[2];
                detail1.AccKey = editValues[3];
                detail1.AccNum = editValues[4];
                detail1.AccDesc = editValues[5];
                detail1.OUCode = editValues[6];
                detail1.Remarks = editValues[7];
                detail1.FuncTransAmt = editValues[8];
                detail1.LocalTransAmt = editValues[9];
                detail1.OrigTransAmt = editValues[10];
                detail1.TaxableTransAmt = editValues[11];
                detail1.InclusiveTransAmt = editValues[12];
                detail1.OrigDrAmt = editValues[13];
                detail1.OrignCrAmt = editValues[14];
                detail1.DetRevAmt = editValues[15];
                detail1.CCIDKey = editValues[16];
                detail1.SetupPrimaryKey = editValues[17];
                detail1.CCID = editValues[18];
                detail1.AccNumAccDesc = editValues[19];
                detail1.CCIDCodeCCIDDesc = editValues[20];
            }

            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.AccKey = editValues[21];
                detail2.AccNum = editValues[22];
                detail2.Remarks = editValues[23];
                detail2.FuncTransAmt = editValues[24];
                detail2.LocalTransAmt = editValues[25];
                detail2.OrigTransAmt = editValues[26];
                detail2.TaxableTransAmt = editValues[27];
                detail2.InclusiveTransAmt = editValues[28];
                detail2.OrigDrAmt = editValues[29];
                detail2.OrigCrAmt = editValues[30];
                detail2.DetRevAmt = editValues[31];
                detail2.CCIDKey = editValues[32];
                detail2.CCID = editValues[33];
            }

            if (updatePayload.glDetails && updatePayload.glDetails[2]) {
                const detail3 = updatePayload.glDetails[2];
                detail3.TransDetKey = editValues[34];
                detail3.TransHdrKey = keyToUse;
                detail3.AccKey = editValues[35];
                detail3.AccNum = editValues[36];
                detail3.AccDesc = editValues[37];
                detail3.OUCode = editValues[38];
                detail3.Remarks = editValues[39];
                detail3.FuncTransAmt = editValues[40];
                detail3.LocalTransAmt = editValues[41];
                detail3.OrigTransAmt = editValues[42];
                detail3.TaxableTransAmt = editValues[43];
                detail3.InclusiveTransAmt = editValues[44];
                detail3.OrigDrAmt = editValues[45];
                detail3.OrigCrAmt = editValues[46];
                detail3.DetRevAmt = editValues[47];
                detail3.CCIDKey = editValues[48];
                detail3.SetupPrimaryKey = editValues[49];
                detail3.CCID = editValues[50];
                detail3.AccNumAccDesc = editValues[51];
                detail3.CCIDCodeCCIDDesc = editValues[52];
            }

            if (updatePayload.glDetailsAPAR && updatePayload.glDetailsAPAR[0]) {
                const detail4 = updatePayload.glDetailsAPAR[0];
                detail4.TransDetAPARKey = editValues[53];
                detail4.TransDetKey = editValues[54];
                detail4.TransHdrKey = editValues[55];
            }

            if (updatePayload.glDetailsAPAR && updatePayload.glDetailsAPAR[1]) {
                const detail5 = updatePayload.glDetailsAPAR[1];
                detail5.TransDetAPARKey = editValues[56];
                detail5.TransDetKey = editValues[57];
                detail5.TransHdrKey = editValues[58];
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