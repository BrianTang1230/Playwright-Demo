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
const formName = "General Journal";
const basePayloads = AccountPayloads.GeneralJournal;
const savedKey = ID.GeneralJournal.TransHdrKey;
const savedDocNo = ID.GeneralJournal.num;

test.describe.serial("General Journal API Test", () => {
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
    test("Add new General Journal transaction", async ({ api }) => {
    apiObj.setUrl(
      `${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`
    );
      const { HdrKey, num, status, json } = await apiObj.create(
        {
          ...basePayloads,
          OUCode: createValues[0],
          OUDesc: createValues[1],
          GLDate: currentDate.toISOString(),
          GLDesc: createValues[2],
          InvoiceDate: currentDate.toISOString(),
          CreatedDate: currentDate.toISOString(),
          UpdatedDate: currentDate.toISOString(),
          glDetails: [
            {
              AccNum: createValues[3],
              AccDesc: createValues[4],
              OUCode: createValues[5],
              Remarks: createValues[6],
              CCID: createValues[7],
              AccNumAccDesc: createValues[8],
              CCIDCodeCCIDDesc: createValues[9],
              rowid: createValues[10],
            },
            {
              AccNum: createValues[11],
              AccDesc: createValues[12],
              OUCode: createValues[13],
              Remarks: createValues[14],
              CCID: createValues[15],
              AccNumAccDesc: createValues[16],
              CCIDCodeCCIDDesc: createValues[17],
              rowid: createValues[18],
            }
          ]
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
    test("Get General Journal transaction by HdrKey", async ({ api }) => {
      const keyToUse = TransHdrKey || savedKey;
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json`
        );
          await apiObj.getByKey();
        });

    // GET ALL
    test("Get all General Journal transactions", async ({ api }) => {
        apiObj.setUrl(
          `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUCode,DocNum,Source,DocType,GLDate,FY,Period,InvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,CreatedByCode,UpdatedByCode,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,VoidByCode,IsSelect,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%206)&DocType=GJ`
        );
          await apiObj.getAll();
    });

    // UPDATE
    test("Update General Journal transaction", async ({ api }) => {
      const keyToUse = TransHdrKey || savedKey;
      const docNoToUse = DocNum || savedDocNo;
      expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
      
      apiObj.setUrl(`${accUrl}/api/GL?form=%27GL%27&Environment=qaa&AttachmentID=""`);

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
        detail1.OrigDrAmt = editValues[6];
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
        detail2.OrigCrAmt = editValues[13];
        detail2.DetRevAmt = editValues[14];
    }

    // --- END OF PAYLOAD ---
    
    const { status, json } = await apiObj.update("POST", updatePayload);
    
    expect(status).toBe(200);
  });

    test("Delete General Journal Transaction using SQL(Clean Up)", async () => {
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
