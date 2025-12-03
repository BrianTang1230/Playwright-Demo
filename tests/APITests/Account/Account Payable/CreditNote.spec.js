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
            payloadToSend.OUKey = 4;
            payloadToSend.OUCode = "LHSE";
            payloadToSend.OUDesc = "LEONG HIN SAN ESTATE";
            payloadToSend.GLDesc = "Test Credit Note";
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.DocAmt = 10000;
            payloadToSend.DueDate = dueDate.toISOString();
            payloadToSend.InvoiceDate = currentDate.toISOString();
            payloadToSend.createdDate = currentDate.toISOString();
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toISOString();
            payloadToSend.RefNo = "A1234561";

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey = 4701;
                detail1.AccNum = "32981310";
                detail1.AccDesc = "OTHER CREDITOR CONTRACTOR - LHS";
                detail1.OUKey = 4;
                detail1.OUCode = "LHSE";
                detail1.Remarks = "Test Credit Note";
                detail1.FuncTransAmt = -10000;
                detail1.LocalTransAmt = -10000;
                detail1.OrigTransAmt = -10000;
                detail1.TaxableTransAmt = 0;
                detail1.InclusiveTransAmt = 0;
                detail1.OrigDrAmt = 0;
                detail1.OrigCrAmt = 10000;
                detail1.DetRevAmt = 0;
                detail1.CCIDKey = 1959;
                detail1.CCID = "OCCLHS001";
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = 3256;
                detail2.AccNum = "12011010";
                detail2.AccDesc = "PAYMENT ADVANCE - PI";
                detail2.OUKey = 4;
                detail2.OUCode = "LHSE";
                detail2.Remarks = "Test Credit Note";
                detail2.FuncTransAmt = 10000;
                detail2.LocalTransAmt = 10000;
                detail2.OrigTransAmt = 10000;
                detail2.TaxableTransAmt = 0;
                detail2.InclusiveTransAmt = 10000;
                detail2.OrigDrAmt = 10000;
                detail2.TaxableTransAmt = 0;
                detail2.InclusiveTransAmt = 10000;
                detail2.OrigDrAmt = 10000;
                detail2.OrigCrAmt = 0;
                detail2.DetRevAmt = 0;
                detail2.CCIDKey = 2000;
                detail2.CCID = "OCCLHSA001";
                detail2.UnitPrice = 10000;
                detail2.AccNumAccDesc = "12011010 - PAYMENT ADVANCE - PI";
                detail2.CCIDCodeCCIDDesc = "OCCLHSA001 - ACS PLANTATION SDN. BHD.";
                detail2.AOSGLDate = currentDate.toISOString();
                detail2.rowid = "ec9bd51a-fc18-4920-a862-43318489baf8";
                detail2.SIDate = currentDate.toISOString();
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
            updatePayload.DocAmt = 15000;
            updatePayload.RowState = 2; 

            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.TransHdrKey = keyToUse;
                detail1.Remarks = "Update Credit Note";
                detail1.FuncTransAmt = -15000;
                detail1.LocalTransAmt = -15000;
                detail1.OrigTransAmt = -15000;
                detail1.TaxableTransAmt = 0;
                detail1.InclusiveTransAmt = -10000;
                detail1.OrigDrAmt = 0;
                detail1.OrigCrAmt = 15000;
                detail1.DetRevAmt = 10000;
                detail1.SetupPrimaryKey = 2011;
            }

            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.TransHdrKey = keyToUse;
                detail2.Remarks = "Update Credit Note";
                detail2.FuncTransAmt = 15000;
                detail2.LocalTransAmt = 15000;
                detail2.OrigTransAmt = 15000;
                detail2.TaxableTransAmt = 0;
                detail2.InclusiveTransAmt = 15000;
                detail2.OrigDrAmt = 15000;
                detail2.OrigCrAmt = 0;
                detail2.DetRevAmt = -10000;
                detail2.SetupPrimaryKey = 2052;
                detail2.UnitPrice = 7500;
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
});