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

            payloadToSend.OUCode = "UMBB";
            payloadToSend.OUDesc =  "UNITED MALACCA BERHAD";
            payloadToSend.GLDate = currentDate.toISOString();
            payloadToSend.DueDate = dueDate.toISOString();
            payloadToSend.InvoiceDate = currentDate.toISOString();
            payloadToSend.CreatedDate = currentDate.toISOString();
            payloadToSend.UpdatedDate = currentDate.toISOString();

            if (payloadToSend.glDetails && payloadToSend.glDetails[0]) {
                const detail1 = payloadToSend.glDetails[0];
                detail1.AccKey = 4699;
                detail1.AccNum = "32981210";
                detail1.AccDesc =  "OTHER CREDITOR CONTRACTOR - PEN";
                detail1.OUCode = "UMBB";
                detail1.Remarks = "Test Credit Note";
                detail1.FuncTransAmt = -1250;
                detail1.LocalTransAmt = -1250;
                detail1.OrigTransAmt = -1250;
                 detail1.OrigCrAmt = 1250;
                detail1.CurrKey = 100;
                detail1.CCIDKey = 925;
            }

            if (payloadToSend.glDetails && payloadToSend.glDetails[1]) {
                const detail2 = payloadToSend.glDetails[1];
                detail2.AccKey = 3281;
                detail2.AccNum = "12921010";
                detail2.AccDesc = "DEPOSITS (GENERAL)";
                detail2.OUKey = 1;
                detail2.OUCode = "UMBB";
                detail2.Remarks = "Test";
                detail2.FuncTransAmt = 1250;
                detail2.LocalTransAmt = 1250;
                detail2.OrigTransAmt = 1250;
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

        /* UPDATE 
        test("Update Cash Payment transaction", async ({ api }) => {
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
            updatePayload.RowState = 2; 
        }); */
    });
})