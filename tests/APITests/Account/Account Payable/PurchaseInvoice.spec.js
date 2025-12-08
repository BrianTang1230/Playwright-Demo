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
const formName = "Purchase Invoice";
const basePayloads = AccountPayloads.PurchaseInvoice;
const savedKey = ID.PurchaseInvoice.TransHdrKey;
const savedDocNo = ID.PurchaseInvoice.num;

test.describe.serial("Purchase Invoice API Test", () => {
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
        test("Add Purchase Invoice", async ({ api }) => {

            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27PI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );

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
            payloadToSend.UpdateDate = currentDate.toISOString();

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
                detail2.Remarks = createValues[25];
                detail2.FuncTransAmt = createValues[26];
                detail2.LocalTransAmt = createValues[27];
                detail2.OrigTransAmt = createValues[28];
                detail2.TaxableTransAmt = createValues[29];
                detail2.InclusiveTransAmt = createValues[30];
                detail2.OrigDrAmt = createValues[31];
                detail2.OrigCrAmt = createValues[32];
                detail2.CCIDKey = createValues[33];
                detail2.CCID = createValues[34];
                detail2.Qty = createValues[35];
                detail2.UnitPrice = createValues[36];
                detail2.AccNumAccDesc = createValues[37];
                detail2.CCIDCodeCCIDDesc = createValues[38];
                detail2.AOSGLDate = currentDate.toISOString();
                detail2.rowid = createValues[39];
                detail2.SIDate = currentDate.toISOString();
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[2]) {
                const detail3 = payloadToSend.glDetails[2];
                detail3.AccKey = createValues[40];
                detail3.AccNum = createValues[41];
                detail3.AccDesc = createValues[42];
                detail3.OUKey = createValues[43];
                detail3.OUCode = createValues[44];
                detail3.Remarks = createValues[45];
                detail3.FuncTransAmt = createValues[46];
                detail3.LocalTransAmt = createValues[47];
                detail3.TaxableTransAmt = createValues[48];
                detail3.InclusiveTransAmt = createValues[49];
                detail3.OrigDrAmt = createValues[50];
                detail3.OrigCrAmt = createValues[51];
                detail3.DetRevAmt = createValues[52];
                detail3.CCIDKey = createValues[53];
                detail3.CCID = createValues[54];
                detail3.Qty = createValues[55];
                detail3.UnitPrice = createValues[56];
                detail3.AccNumAccDesc = createValues[57];
                detail3.CCIDCodeCCIDDesc = createValues[58];
                detail3.AOSGLDate = currentDate.toISOString();
                detail3.rowid = createValues[59];
                detail3.SIDate = currentDate.toISOString();
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
        test("Get Purchase Invoice by HdrKey", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?TransHdrKey=${keyToUse}&$format=json&$expand=OTVendorData`
            );
                await apiObj.getByKey();
        });
                            
        // GET ALL
        test("Get all Purchase Invoice", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/GLHeader?$expand=glDetails&$format=json&$orderby=GLDate%20desc,TransHdrKey&$select=TransHdrKey,OUKey,OUCode,DocNum,Source,CCIDCodeCCIDDesc,DocType,GLDate,FY,Period,InvNum,InvoiceDate,TaxInvNum,PayTermCode,DueDate,GLStatusDesc,GLDesc,CurrCode,DocAmt,Reason,PaymentStatus,PaymentDoc,CreatedByCode,CreatedDate,UpdatedByCode,UpdatedDate,L1ApprovedByName,L1ApprovedDate,L2ApprovedByName,L2ApprovedDate,L3ApprovedByName,L3ApprovedDate,LastApprovedByCode,LastApprovedDate,VoidByCode,VoidDate,IsSelect,IsContainGRNI,FinalPayHdrKey,IsContainAttach,glDetails/TransDetKey,glDetails/AccNum,glDetails/AccDesc,glDetails/CCID,glDetails/Remarks,glDetails/Ind,glDetails/CurrCode,glDetails/OrigTransAmt,glDetails/Qty,glDetails/UOM,glDetails/UnitPrice,glDetails/ExRateFunc,glDetails/FuncTransAmt&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%207)&DocType=PI`
            );
            await apiObj.getAll();
        });

        // UPDATE 
        test("Update Purchase Invoice", async ({ api }) => {
            const keyToUse = TransHdrKey || savedKey;
            const docNoToUse = DocNum || savedDocNo;
            expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
                
            apiObj.setUrl(
                `${accUrl}/api/GL?form=%27PI%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`
            );
                
            // Update Payload
            // copy the record from the server
            const updatePayload = JSON.parse(JSON.stringify(createdRecord));
                
            // Main Header Field
            updatePayload.TransHdrKey = keyToUse;
            updatePayload.DocNum = docNoToUse;
            updatePayload.DocAmt = editValues[0];
            updatePayload.PayTermKey = editValues[1];
            updatePayload.RowState = editValues[2];
        
            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.TransHdrKey = keyToUse;
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
                detail1.ItemCatCode = editValues[13];
                detail1.AccNumAccDesc = editValues[14];
                detail1.CCIDCodeCCIDDesc = editValues[15];
                detail1.AdjAccNumAccDesc = editValues[16];
                detail1.SINum = editValues[17];
            }
        
            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.TransHdrKey = keyToUse;
                detail2.Remarks = editValues[18];
                detail2.FuncTransAmt = editValues[19];
                detail2.LocalTransAmt = editValues[20];
                detail2.OrigTransAmt = editValues[21];
                detail2.TaxableTransAmt = editValues[22];
                detail2.InclusiveTransAmt = editValues[23];
                detail2.OrigDrAmt = editValues[24];
                detail2.OrigCrAmt = editValues[25];
                detail2.DetRevAmt = editValues[26];
                detail2.SetupPrimaryKey = editValues[27];
                detail2.Qty = editValues[28];
                detail2.UnitPrice = editValues[29];
                detail2.ItemCatCode = editValues[30];
                detail2.AdjAccNumAccDesc = editValues[31];
                detail2.SINum = editValues[32];
            }
        
            if (updatePayload.glDetails && updatePayload.glDetails[2]) {
                const detail3 = updatePayload.glDetails[2];
                detail3.TransHdrKey = keyToUse;
                detail3.Remarks = editValues[33];
                detail3.FuncTransAmt = editValues[34];
                detail3.LocalTransAmt = editValues[35];
                detail3.OrigTransAmt = editValues[36];
                detail3.TaxableTransAmt = editValues[37];
                detail3.InclusiveTransAmt = editValues[38];
                detail3.OrigDrAmt = editValues[39];
                detail3.OrigCrAmt = editValues[40];
                detail3.DetRevAmt = editValues[41];
                detail3.SetupPrimaryKey = editValues[42];
                detail3.Qty = editValues[43];
                detail3.UnitPrice = editValues[44];
                detail3.ItemCatCode = editValues[45];
                detail3.SINum = editValues[46];
            }

            // --- END OF PAYLOAD ---
                                
            const { status, json } = await apiObj.update("POST", updatePayload);
                                
            expect(status).toBe(200);
        });

        test("Delete Purchase Invoice using SQL(Clean Up)", async () => {
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