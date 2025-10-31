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
const formName = "Closed Period Adjustment";
const basePayloads = AccountPayloads.ClosedPeriodAdjustment;
const savedKey = ID.ClosedPeriodAdjustment.TransHdrKey;
const savedDocNo = ID.ClosedPeriodAdjustment.num;

test.describe.serial("Closed Period Adjustment API Test", () => {
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
    test("Add new Close Period Adjustment", async ({ api }) => {
    apiObj.setUrl(
      `${accUrl}/api/GL?form=%27AJ%27&Environment=qaa&AttachmentID=""`
    );

      const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
      payloadToSend.OUCode = createValues[0];
      payloadToSend.OUDesc = createValues[1];
      payloadToSend.GLDate = currentDate.toISOString();
      payloadToSend.GLDesc = createValues[2];
      payloadToSend.InvoiceDate = currentDate.toISOString();
      payloadToSend.CreatedDate = currentDate.toISOString();
      payloadToSend.UpdatedDate = currentDate.toISOString();

      if (payloadToSend.glDetails && payloadToSend.glDetails[0]){
        const detail1 = payloadToSend.glDetails[0];
        detail1.AccNum = createValues[3];
        detail1.AccDesc = createValues[4];
        detail1.OUCode = createValues[5];
        detail1.Remarks = createValues[6];
        detail1.CCID = createValues[7];
        detail1.AccNumAccDesc = createValues[8];
        detail1.CCIDCodeCCIDDesc = createValues[9];
        detail1.rowid = createValues[10];
      }

      if (payloadToSend.glDetails && payloadToSend.glDetails[1]){
        const detail2 = payloadToSend.glDetails[1];
        detail2.AccNum = createValues[11];
        detail2.AccDesc = createValues[12];
        detail2.OUCode = createValues[13];
        detail2.Remarks = createValues[14];
        detail2.CCID = createValues[15];
        detail2.AccNumAccDesc = createValues[16];
        detail2.CCIDCodeCCIDDesc = createValues[17];
        detail2.rowid = createValues[18];
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
    test("Get Closed Period Adjustment by HdrKey", async ({ api }) => {
      const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
        );
          await apiObj.getByKey();
        });

    // GET ALL
    test("Get all Closed Period Adjustment", async ({ api }) => {
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsContainAttach,IsSelect,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=AJ`
        );
          await apiObj.getAll();
    });

    // UPDATE
    test("Update Closed Period Adjustment", async ({ api }) => {
      const keyToUse = TransHdrKey || savedKey;
      const docNoToUse = DocNum || savedDocNo;
      expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
      
      apiObj.setUrl(`${accUrl}/api/GL?form=%27AJ%27&Environment=qaa&AttachmentID=""`);

    // --- UPDATE PAYLOAD ---
    // Use the captured 'createdRecord' to build the correct update payload.
    const updatePayload = JSON.parse(JSON.stringify(createdRecord));

    // Apply changes to the main header fields
    updatePayload.TransHdrKey = keyToUse;
    updatePayload.DocNum = keyToUse;
    updatePayload.RowState = 2; 
    updatePayload.DocAmt = editValues[0]; 

    // Modify the *first* object inside the glDetails array
    if (updatePayload.glDetails && updatePayload.glDetails[0]) {
        const detail1 = updatePayload.glDetails[0];
        detail1.TransHdrKey = keyToUse;
        detail1.Remarks = editValues[1];
        detail1.FuncTransAmt = editValues[2];
        detail1.LocalTransAmt = editValues[3];
        detail1.OrigTransAmt = editValues[4];
        detail1.InclusiveTransAmt = editValues[5];
        detail1.OrigCrAmt = editValues[6]; 
        detail1.DetRevAmt = editValues[7];
    }

    // Modify the *second* object inside the glDetails array
    if (updatePayload.glDetails && updatePayload.glDetails[1]) {
        const detail2 = updatePayload.glDetails[1];
        detail2.TransHdrKey = keyToUse;
        detail2.Remarks = editValues[8];
        detail2.FuncTransAmt = editValues[9];
        detail2.LocalTransAmt = editValues[10];
        detail2.OrigTransAmt = editValues[11];
        detail2.InclusiveTransAmt = editValues[12];
        detail2.OrigDrAmt = editValues[13]; 
        detail2.DetRevAmt = editValues[14];
    }

    // --- END OF PAYLOAD ---
    
    const { status, json } = await apiObj.update("POST", updatePayload);
    
    expect(status).toBe(200);
  });

    test("Delete Closed Period Adjustment using SQL(Clean Up)", async () => {
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
