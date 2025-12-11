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
const formName = "Sales Invoice";
const basePayloads = AccountPayloads.SalesInvoice;
const savedKey = ID.SalesInvoice.TransHdrKey;
const savedDocNo = ID.SalesInvoice.num;

test.describe.serial("Sales Invoice API Test", () => {
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

    test("Add new Sales Invoice", async ({ api }) => {
        // 1. Set URL
        const apiUrl = `${accUrl}/api/GL?form=%27SI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
        apiObj.setUrl(apiUrl);

        // 2. Build Payload
        const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
        payloadToSend.OUKey = createValues[0];
        payloadToSend.OUCode = createValues[1];
        payloadToSend.OUDesc = createValues[2];
        payloadToSend.GLDate = currentDate.toISOString();
        payloadToSend.GLDesc = createValues[3];
        payloadToSend.DocAmt = createValues[4];
        payloadToSend.dueDate = dueDate.toISOString();
        payloadToSend.InvoiceDate = currentDate.toISOString();
        payloadToSend.InvNum = createValues[5];
        payloadToSend.CreatedDate = currentDate.toISOString();
        payloadToSend.UpdatedDate = currentDate.toISOString();
        payloadToSend.RefNo = createValues[6];

        if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
            const detail1 = payloadToSend.glDetails[0];
            detail1.AccKey = createValues[7];
            detail1.AccNum = createValues[8];
            detail1.AccDesc = createValues[9];
            detail1.OUKey = createValues[10];
            detail1.Remarks = createValues[11];
            detail1.FuncTransAmt = createValues[12];
            detail1.LocalTransAmt = createValues[13];
            detail1.OrigTransAmt = createValues[14];
            detail1.TaxableTransAmt = createValues[15];
            detail1.InclusiveTransAmt = createValues[16];
            detail1.OrigDrAmt = createValues[17];
            detail1.OrigCrAmt = createValues[18];
            detail1.DetRevAmt = createValues[19];
            detail1.CCIDKey = createValues[20];
            detail1.CCID = createValues[21];
        }

        if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
            const detail2 = payloadToSend.glDetails[1];
            detail2.AccKey = createValues[22];
            detail2.AccNum = createValues[23];
            detail2.AccDesc = createValues[24];
            detail2.OUKey = createValues[25];
            detail2.OUCode = createValues[26];
            detail2.Remarks = createValues[27];
            detail2.FuncTransAmt = createValues[28];
            detail2.LocalTransAmt = createValues[29];
            detail2.OrigTransAmt = createValues[30];
            detail2.TaxableTransAmt = createValues[31];
            detail2.InclusiveTransAmt = createValues[32];
            detail2.OrigDrAmt = createValues[33];
            detail2.OrigCrAmt = createValues[34];
            detail2.DetRevAmt = createValues[35];
            detail2.CCIDKey = createValues[36];
            detail2.CCID = createValues[37];
            detail2.Qty = createValues[38];
            detail2.UnitPrice = createValues[39];
            detail2.AccNumAccDesc = createValues[40];
            detail2.CCIDCodeCCIDDesc = createValues[41];
            detail2.AOSGLDate = currentDate.toISOString();
            detail2.rowid = createValues[42];
            detail2.DeliveredDate = currentDate.toISOString();
            detail2.BuyerReceivedDate = currentDate.toISOString();
        }

        if (payloadToSend.glDetails && payloadToSend.glDetails[2]) {
            const detail3 = payloadToSend.glDetails[2];
            detail3.AccKey = createValues[43];
            detail3.AccNum = createValues[44];
            detail3.AccDesc = createValues[45];
            detail3.OUKey = createValues[46];
            detail3.OUCode = createValues[47];
            detail3.Remarks = createValues[48];
            detail3.FuncTransAmt = createValues[49];
            detail3.LocalTransAmt = createValues[50];
            detail3.OrigTransAmt = createValues[51];
            detail3.TaxableTransAmt = createValues[52];
            detail3.InclusiveTransAmt = createValues[53];
            detail3.OrigDrAmt = createValues[54];
            detail3.OrigCrAmt = createValues[55];
            detail3.DetRevAmt = createValues[56];
            detail3.CCIDKey = createValues[57];
            detail3.CCID = createValues[58];
            detail3.AccNumAccDesc = createValues[59];
            detail3.CCIDCodeCCIDDesc = createValues[60];
            detail3.AOSGLDate = currentDate.toISOString();
            detail3.rowid = createValues[61];
            detail3.DeliveredDate = currentDate.toISOString();
            detail3.BuyerReceivedDate = currentDate.toISOString();
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
    test("Get Sales Invoice by HdrKey", async ({ api }) => {
        const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json&$expand=OTVendorData`
        );
            await apiObj.getByKey();
    });
                            
    // GET ALL
    test("Get all Sales Invoice", async ({ api }) => {
        apiObj.setUrl(
            `${accUrl}/odata/GLHeader?DocType=CustomSI&$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,OUKey,DocNum,Source,CCIDCodeCCIDDesc,DocType,CDTypeDesc,GLDate,FY,Period,InvNum,TaxInvNum,RemarkCode,TaxInvRemarkKey,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,ContractNo,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/Ind,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/Qty,glDetails/UOM,glDetails/TicketNo,glDetails/UnitPrice,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)`
        );
        await apiObj.getAll();
    });

    // UPDATE 
    test("Update Sales Invoice", async ({ api }) => {
        const keyToUse = TransHdrKey || savedKey;
        const docNoToUse = DocNum || savedDocNo;
        expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
                
        apiObj.setUrl(
            `${accUrl}/api/GL?form=%27SI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
        );
                
        // Update Payload
        // copy the record from the server
        const updatePayload = JSON.parse(JSON.stringify(createdRecord));
        updatePayload.TransHdrKey = keyToUse;
        updatePayload.DocAmt = editValues[0];
        updatePayload.RowState = 2;

        if (updatePayload.glDetails && updatePayload.glDetails[0]) {
            const detail1 = updatePayload.glDetails[0];
            detail1.TransHdrKey = keyToUse;
            detail1.Remarks = editValues[1];
            detail1.FuncTransAmt = editValues[2];
            detail1.LocalTransAmt = editValues[3];
            detail1.OrigTransAmt = editValues[4];
            detail1.TaxableTransAmt = editValues[5];
            detail1.InclusiveTransAmt = editValues[6];
            detail1.OrigDrAmt = editValues[7];
            detail1.OrigCrAmt = editValues[8];
            detail1.DetRevAmt = editValues[9];
            detail1.SetupPrimaryKey = editValues[10];
            detail1.AccNumAccDesc = editValues[11];
            detail1.CCIDCodeCCIDDesc = editValues[12];
            detail1.SINum = editValues[13];
        }

        if (updatePayload.glDetails && updatePayload.glDetails[1]) {
            const detail2 = updatePayload.glDetails[1];
            detail2.ClientKey = editValues[14];
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
            detail2.SINum = editValues[27];
        }

        if (updatePayload.glDetails && updatePayload.glDetails[2]) {
            const detail3 = updatePayload.glDetails[2];
            detail3.TransHdrKey = keyToUse;
            detail3.ClientKey = editValues[28];
            detail3.Remarks = editValues[29];
            detail3.FuncTransAmt = editValues[30];
            detail3.LocalTransAmt = editValues[31];
            detail3.OrigTransAmt = editValues[32];
            detail3.TaxableTransAmt = editValues[33];
            detail3.OrigDrAmt = editValues[34];
            detail3.OrigCrAmt = editValues[35];
            detail3.DetRevAmt = editValues[36];
            detail3.SetupPrimaryKey = editValues[37];
            detail3.Qty = editValues[38];
            detail3.UnitPrice = editValues[39];
            detail3.SINum = editValues[40];
        }
        
        // --- END OF PAYLOAD ---
                        
        const { status, json } = await apiObj.update("POST", updatePayload);
        
        expect(status).toBe(200);
    });

    test("Delete Sales Invoice using SQL(Clean Up)", async () => {
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