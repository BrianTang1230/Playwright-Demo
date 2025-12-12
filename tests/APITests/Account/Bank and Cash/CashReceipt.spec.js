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
let TransHdrKey, DocNum;
let createValues, editValues;
const currentDate = new Date();
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Cash Receipt";
const basePayloads = AccountPayloads.CashReceipt;
const savedKey = ID.CashReceipt.HdrKey;
const savedDocNo = ID.CashReceipt.num;

test.describe.serial("Cash Receipt API Test", () => {
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
      test("Add new Cash Receipt", async ({ api }) => {
      apiObj.setUrl(
        `${accUrl}/api/GL?form=%27CR%27&Environment=qaa&AttachmentID=""`
      );
  
        const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
        payloadToSend.OUKey = createValues[0];
        payloadToSend.OUDesc = createValues[1];
        payloadToSend.GLDate = currentDate.toISOString();
        payloadToSend.GLDesc = createValues[2];
        payloadToSend.DocAmt = createValues[3];
        payloadToSend.createdDate = currentDate.toISOString();
        payloadToSend.UpdatedDate = currentDate.toISOString();
        payloadToSend.Remarks = createValues[4];
        payloadToSend.RefNo = createValues[5];
  
        if (payloadToSend.glDetails && payloadToSend.glDetails[0]){
            const detail1 = payloadToSend.glDetails[0];
            detail1.AccKey = createValues[6];
            detail1.AccNum = createValues[7];
            detail1.AccDesc = createValues[8];
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
            detail1.CCIDKey = createValues[19];
            detail1.CCID = createValues[20];
            detail1.AccNumAccDesc = createValues[21];
            detail1.CCIDCodeCCIDDesc = createValues[22];
            detail1.rowid = createValues[23];
            detail1.InvoiceDate = currentDate.toISOString();
        }
  
        if (payloadToSend.glDetails && payloadToSend.glDetails[1]){
            const detail2 = payloadToSend.glDetails[1];
            detail2.AccKey = createValues[24];
            detail2.AccNum = createValues[25];
            detail2.AccDesc = createValues[26];
            detail2.OUKey = createValues[27];
            detail2.Remarks = createValues[28];
            detail2.FuncTransAmt = createValues[29];
            detail2.LocalTransAmt = createValues[30];
            detail2.OrigTransAmt = createValues[31];
            detail2.TaxableTransAmt = createValues[32];
            detail2.InclusiveTransAmt = createValues[33];
            detail2.OrigDrAmt = createValues[34];
            detail2.OrigCrAmt = createValues[35];
            detail2.DetRevAmt = createValues[36];
            detail2.CCIDKey = createValues[37];
            detail2.CCID = createValues[38];
            detail2.Qty = createValues[39];
            detail2.AccNumAccDesc = createValues[40];
            detail2.CCIDCodeCCIDDesc = createValues[41];
            detail2.rowid = createValues[42];
            detail2.InvoiceDate = currentDate.toISOString();
        }

        if (payloadToSend.glDetails && payloadToSend.glDetails[2]) {
            const detail3 = payloadToSend.glDetails[2];
            detail3.AccKey = createValues[43];
            detail3.AccNum = createValues[44];
            detail3.AccDesc = createValues[45];
            detail3.OUKey = createValues[46];
            detail3.Remarks = createValues[47];
            detail3.FuncTransAmt = createValues[48];
            detail3.LocalTransAmt = createValues[49];
            detail3.OrigTransAmt = createValues[50];
            detail3.TaxableTransAmt = createValues[51];
            detail3.InclusiveTransAmt = createValues[52];
            detail3.OrigDrAmt = createValues[53];
            detail3.OrigCrAmt = createValues[54];
            detail3.DetRevAmt = createValues[55];
            detail3.CCIDKey = createValues[56];
            detail3.CCID = createValues[57];
        }

        if (payloadToSend.transDetBC && payloadToSend.transDetBC[0]) {
            const detail4 = payloadToSend.transDetBC[0];
            detail4.PayTo = createValues[58];
        }
  
        const { HdrKey, num, status, json } = await apiObj.create(
            payloadToSend,
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
    test("Get Cash Receipt by HdrKey", async ({ api }) => {
      const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
        );
          await apiObj.getByKey();
        });

    // GET ALL
    test("Get all Cash Receipts", async ({ api }) => {
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)&DocType=CR`
        );
          await apiObj.getAll();
    });

    // UPDATE
    test("Update Cash Receipt", async ({ api }) => {
    const keyToUse = TransHdrKey || savedKey;
    const docNoToUse = DocNum || savedDocNo;
    expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
    
    apiObj.setUrl(`${accUrl}/api/GL?form=%27CR%27&Environment=qaa&AttachmentID=""`);

    // Update Payload
    // copy of the record from the server
    const updatePayload = JSON.parse(JSON.stringify(createdRecord));

    // Main Header Field
    updatePayload.TransHdrKey = keyToUse;
    updatePayload.DocNum = docNoToUse;
    updatePayload.DocAmt = editValues[0];
    updatePayload.RowState = 2;
    updatePayload.Remarks = editValues[1];

    // Modify the *first* object inside the glDetails array
    if (updatePayload.glDetails && updatePayload.glDetails[0]) {
        const detail1 = updatePayload.glDetails[0];
        detail1.TransHdrKey = keyToUse;
        detail1.ClientKey = editValues[2];
        detail1.Remarks = editValues[3];
        detail1.FuncTransAmt = editValues[4];
        detail1.LocalTransAmt = editValues[5];
        detail1.OrigTransAmt = editValues[6];
        detail1.TaxableTransAmt = editValues[7];
        detail1.InclusiveTransAmt = editValues[8];
        detail1.OrigDrAmt = editValues[9];
        detail1.OrigCrAmt = editValues[10];
        detail1.DetRevAmt = editValues[11];
        detail1.SetupPrimaryKey = editValues[12];
        detail1.Qty = editValues[13];
    }

    // Modify the *second* object inside the glDetails array
    if (updatePayload.glDetails && updatePayload.glDetails[1]) {
        const detail2 = updatePayload.glDetails[1];
        detail2.TransHdrKey = keyToUse;
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
    }

    if (updatePayload.glDetails && updatePayload.glDetails[2]) {
        const detail3 = updatePayload.glDetails[2];
        detail3.TransHdrKey = keyToUse;
        detail3.ClientKey = editValues[26];
        detail3.OUCode = editValues[27];
        detail3.Remarks = editValues[28];
        detail3.FuncTransAmt = editValues[29];
        detail3.LocalTransAmt = editValues[30];
        detail3.OrigTransAmt = editValues[31];
        detail3.TaxableTransAmt = editValues[32];
        detail3.InclusiveTransAmt = editValues[33];
        detail3.OrigDrAmt = editValues[34];
        detail3.OrigCrAmt = editValues[35];
        detail3.DetRevAmt = editValues[36];
        detail3.SetupPrimaryKey = editValues[37];
        detail3.AccNumAccDesc = editValues[38];
        detail3.CCIDCodeCCIDDesc = editValues[39];
    }

    if (updatePayload.transDetBC && updatePayload.transDetBC[0]) {
        const detail4 = updatePayload.transDetBC[0];
        detail4.TransHdrKey = keyToUse;
    }

    // --- END OF PAYLOAD LOGIC ---
    
    const { status, json } = await apiObj.update("POST", updatePayload);
    
    expect(status).toBe(200);
  });

    test("Delete Cash Receipt using SQL(Clean Up)", async () => {
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
});
