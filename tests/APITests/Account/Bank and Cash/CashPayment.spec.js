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
const formName = "Cash Payment";
const basePayloads = AccountPayloads.CashPayment;
const savedKey = ID.CashPayment.HdrKey;
const savedDocNo = ID.CashPayment.num;

test.describe.serial("Cash Payment API Test", () => {
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
    test("Add new Cash Payment transaction", async ({ api }) => {
    apiObj.setUrl(
      `${accUrl}/api/GL?form=%27CP%27&Environment=qaa&AttachmentID=""`
    );
      const { HdrKey, num, status, json } = await apiObj.create(
        {
          ...basePayloads,
          InvoiceDate: currentDate.toISOString(),
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
    test("Get Cash Payment transaction by HdrKey", async ({ api }) => {
      const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
        );
          await apiObj.getByKey();
        });

    // GET ALL
    test("Get all Cash Payment transactions", async ({ api }) => {
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,RefNo,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PayTo,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=CP`
        );
          await apiObj.getAll();
    });

    // UPDATE
    test("Update Cash Payment transaction", async ({ api }) => {
    const keyToUse = TransHdrKey || savedKey;
    const docNoToUse = DocNum || savedDocNo;
    expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
    
    apiObj.setUrl(`${accUrl}/api/GL?form=%27CP%27&Environment=qaa&AttachmentID=""`);

    // Update Payload
    // copy of the record from the server
    const updatePayload = JSON.parse(JSON.stringify(createdRecord));

    // Main Header Field
    updatePayload.TransHdrKey = keyToUse;
    updatePayload.DocNum = docNoToUse;
    updatePayload.OUDesc = editValues[0];
    updatePayload.DocAmt = editValues[1];
    updatePayload.RowState = 2;
    updatePayload.RefNo = editValues[2];
    updatePayload.Remarks = editValues[3];

    // Modify the *first* object inside the glDetails array
    if (updatePayload.glDetails && updatePayload.glDetails[0]) {
        const detail1 = updatePayload.glDetails[0];
        detail1.TransHdrKey = keyToUse; 
        detail1.AccNum = editValues[4];
        detail1.AccDesc = editValues[5];
        detail1.Remarks = editValues[6];
        detail1.FuncTransAmt = editValues[7];
        detail1.LocalTransAmt = editValues[8];
        detail1.OrigTransAmt = editValues[9];
        detail1.InclusiveTransAmt = editValues[10];
        detail1.OrigCrAmt = editValues[11];
        detail1.DetRevAmt = editValues[12];
        detail1.CCID = editValues[13];
        detail1.AccNumAccDesc = editValues[14];
        detail1.CCIDCodeCCIDDesc = editValues[15];
        detail1.IsRequiredCCID = editValues[16];
    }

    // Modify the *second* object inside the glDetails array
    if (updatePayload.glDetails && updatePayload.glDetails[1]) {
        const detail2 = updatePayload.glDetails[1];
        // Important: Keep the original TransDetKey from createdRecord
        detail2.TransHdrKey = keyToUse;
        detail2.AccNum = editValues[17];
        detail2.AccDesc = editValues[18];
        detail2.Remarks = editValues[19];
        detail2.FuncTransAmt = editValues[20];
        detail2.LocalTransAmt = editValues[21];
        detail2.OrigTransAmt = editValues[22];
        detail2.InclusiveTransAmt = editValues[23];
        detail2.OrigDrAmt = editValues[24];
        detail2.DetRevAmt = editValues[25];
        detail2.CCID = editValues[26]; 
        detail2.AccNumAccDesc = editValues[27]; 
        detail2.CCIDCodeCCIDDesc = editValues[28];
        detail2.IsRequiredCCID = editValues[29];
    }

    // 5. Modify the object inside the transDetBC array
    if (updatePayload.transDetBC && updatePayload.transDetBC[0]) {
        // Important: Keep the original TransDetBCKey from createdRecord
        updatePayload.transDetBC[0].PayTo = "BANGUNAN KWSP K.K";
    }

    // --- END OF PAYLOAD LOGIC ---
    
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
});
