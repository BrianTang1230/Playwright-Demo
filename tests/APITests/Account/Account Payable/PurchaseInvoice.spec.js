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
            payloadToSend.OUCode = createValues[0];
            payloadToSend.OUDesc = createValues[1];
            payloadToSend.DocNum = createValues[2];
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.GLDesc = createValues[3];
            payloadToSend.DocAmt = createValues[4];
            payloadToSend.DueDate = dueDate.toISOString();
            payloadToSend.InvoiceDate = currentDate.toISOString();
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toISOString();

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey = createValues[5];
                detail1.AccNum = createValues[6];
                detail1.AccDesc = createValues[7];
                detail1.OUCode = createValues[8];
                detail1.Remarks = createValues[9];
                detail1.FuncTransAmt = createValues[10];
                detail1.LocalTransAmt = createValues[11];
                detail1.OrigTransAmt = createValues[12];
                detail1.OrigCrAmt = createValues[13];
                detail1.CCIDKey = createValues[14];
                detail1.CCID = createValues[15];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = createValues[16];
                detail2.AccNum = createValues[17];
                detail2.AccDesc = createValues[18];
                detail2.OUCode = createValues[19];
                detail2.Remarks = createValues[20];
                detail2.FuncTransAmt = createValues[21];
                detail2.LocalTransAmt = createValues[22];
                detail2.OrigTransAmt = createValues[23];
                detail2.InclusiveTransAmt = createValues[24];
                detail2.OrigDrAmt = createValues[25];
                detail2.Qty = createValues[26];
                detail2.UOMKey = createValues[27];
                detail2.UnitPrice = createValues[28];
                detail2.GRNIKey = createValues[29];
                detail2.DocNum = createValues[30];
                detail2.ItemID = createValues[31];
                detail2.GrossAmt = createValues[32];
                detail2.OpenAmt = createValues[33];
                detail2.AccNumAccDesc = createValues[34];
                detail2.DocDesc = createValues[35];
                detail2.AppliedAmt = createValues[36];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[2]) {
                const detail3 = payloadToSend.glDetails[2];
                detail3.AccKey = createValues[37];
                detail3.AccNum = createValues[38];
                detail3.AccDesc = createValues[39];
                detail3.OUCode = createValues[40];
                detail3.Remarks = createValues[41];
                detail3.FuncTransAmt = createValues[42];
                detail3.LocalTransAmt = createValues[43];
                detail3.OrigTransAmt = createValues[44];
                detail3.TaxableTransAmt = createValues[45];
                detail3.InclusiveTransAmt = createValues[46];
                detail3.OrigDrAmt = createValues[47];
                detail3.Qty = createValues[48];
                detail3.UOMKey = createValues[49];
                detail3.UnitPrice = createValues[50];
                detail3.GRNIKey = createValues[51];
                detail3.DocNum = createValues[52];
                detail3.ItemID = createValues[53];
                detail3.GrossAmt = createValues[54];
                detail3.OpenAmt = createValues[55];
                detail3.AccNumAccDesc = createValues[56];
                detail3.DocDesc = createValues[57];
                detail3.AppliedAmt = createValues[58];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[3]) {
                const detail4 = payloadToSend.glDetails[3];
                detail4.AccKey = createValues[59];
                detail4.AccNum = createValues[60];
                detail4.AccDesc = createValues[61];
                detail4.OUCode = createValues[62];
                detail4.Remarks = createValues[63];
                detail4.FuncTransAmt = createValues[64];
                detail4.LocalTransAmt = createValues[65];
                detail4.OrigTransAmt = createValues[66];
                detail4.TaxableTransAmt = createValues[67];
                detail4.InclusiveTransAmt = createValues[68];
                detail4.OrigDrAmt = createValues[69];
                detail4.UOMKey = createValues[70];
                detail4.UnitPrice = createValues[71];
                detail4.GRNIKey = createValues[72];
                detail4.DocNum = createValues[73];
                detail4.ItemID = createValues[74];
                detail4.GrossAmt = createValues[75];
                detail4.OpenAmt = createValues[76];
                detail4.AccNumAccDesc = createValues[77];
                detail4.DocDesc = createValues[78];
                detail4.AppliedAmt = createValues[79];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[4]) {
                const detail5 = payloadToSend.glDetails[4];
                detail5.AccKey = createValues[80];
                detail5.AccNum = createValues[81];
                detail5.AccDesc = createValues[82];
                detail5.OUCode = createValues[83];
                detail5.Remarks = createValues[84];
                detail5.FuncTransAmt = createValues[85];
                detail5.LocalTransAmt = createValues[86];
                detail5.OrigTransAmt = createValues[87];
                detail5.TaxableTransAmt = createValues[88];
                detail5.InclusiveTransAmt = createValues[89];
                detail5.OrigDrAmt = createValues[90];
                detail5.Qty = createValues[91];
                detail5.UOMKey = createValues[92];
                detail5.UnitPrice = createValues[93];
                detail5.GRNIKey = createValues[94];
                detail5.DocNum = createValues[95];
                detail5.ItemID = createValues[96];
                detail5.GrossAmt = createValues[97];
                detail5.OpenAmt = createValues[98];
                detail5.AccNumAccDesc = createValues[99];
                detail5.DocDesc = createValues[100];
                detail5.AppliedAmt = createValues[101];
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[5]) {
                const detail6 = payloadToSend.glDetails[5];
                detail6.AccKey = createValues[102];
                detail6.AccNum = createValues[103];
                detail6.AccDesc = createValues[104];
                detail6.OUCode = createValues[105];
                detail6.Remarks = createValues[106];
                detail6.FuncTransAmt = createValues[107];
                detail6.LocalTransAmt = createValues[108];
                detail6.OrigTransAmt = createValues[109];
                detail6.TaxableTransAmt = createValues[110];
                detail6.InclusiveTransAmt = createValues[111];
                detail6.OrigDrAmt = createValues[112];
                detail6.Qty = createValues[113];
                detail6.UOMKey = createValues[114];
                detail6.UnitPrice = createValues[115];
                detail6.GRNIKey = createValues[116];
                detail6.DocNum = createValues[117];
                detail6.ItemID = createValues[118];
                detail6.GrossAmt = createValues[119];
                detail6.OpenAmt = createValues[120];
                detail6.AccNumAccDesc = createValues[121];
                detail6.DocDesc = createValues[122];
                detail6.AppliedAmt = createValues[123];
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
            updatePayload.RowState = 2;
        
            if (updatePayload.glDetails && updatePayload.glDetails[0]) {
                const detail1 = updatePayload.glDetails[0];
                detail1.TransHdrKey = keyToUse;
                detail1.FuncTransAmt = editValues[1];
                detail1.LocalTransAmt = editValues[2];
                detail1.OrigTransAmt = editValues[3];
                detail1.InclusiveTransAmt = editValues[4];
                detail1.OrigCrAmt = editValues[5];
                detail1.DetRevAmt = editValues[6];
                detail1.SetupPrimaryKey = editValues[7];
                detail1.AccNumAccDesc = editValues[8];
                detail1.CCIDCodeCCIDDesc = editValues[9];
                detail1.IsRequiredCCID = true;
                detail1.AppliedAmt = 0;
            }
        
            if (updatePayload.glDetails && updatePayload.glDetails[1]) {
                const detail2 = updatePayload.glDetails[1];
                detail2.TransHdrKey = keyToUse;
                detail2.FuncTransAmt = editValues[10];
                detail2.LocalTransAmt = editValues[11];
                detail2.OrigTransAmt = editValues[12];
                detail2.InclusiveTransAmt = editValues[13];
                detail2.OrigDrAmt = editValues[14];
                detail2.DetRevAmt = editValues[15];
                detail2.AppliedAmt = 0;
            }
        
            if (updatePayload.glDetails && updatePayload.glDetails[2]) {
                const detail3 = updatePayload.glDetails[2];
                detail3.TransHdrKey = keyToUse;
                detail3.FuncTransAmt = editValues[16];
                detail3.LocalTransAmt = editValues[17];
                detail3.OrigTransAmt = editValues[18];
                detail3.InclusiveTransAmt = editValues[19];
                detail3.OrigDrAmt = editValues[20];
                detail3.DetRevAmt = editValues[21];
                detail3.AppliedAmt = 0;
            }

            if (updatePayload.glDetails && updatePayload.glDetails[3]) {
                const detail4 = updatePayload.glDetails[3];
                detail4.TransHdrKey = keyToUse;
                detail4.DetRevAmt = editValues[22];
                detail4.AppliedAmt = 0;
            }

            if (updatePayload.glDetails && updatePayload.glDetails[4]) {
                const detail5 = updatePayload.glDetails[4];
                detail5.TransHdrKey = keyToUse;
                detail5.FuncTransAmt = editValues[23];
                detail5.LocalTransAmt = editValues[24];
                detail5.OrigTransAmt = editValues[25];
                detail5.InclusiveTransAmt = editValues[26];
                detail5.OrigDrAmt = editValues[27];
                detail5.DetRevAmt = editValues[28];
                detail5.AppliedAmt = 0;
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