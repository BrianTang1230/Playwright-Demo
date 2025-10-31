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

let apiObj;
let createValues, editValues;
let BankReconHdrKey;
const currentDate = new Date();

// Declare a variable to hold the state of the created record.
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Bank Reconciliation";
const basePayloads = AccountPayloads.BankReconciliation;
const savedKey = ID.BankReconciliation.BankReconHdrKey;

test.describe.serial("Bank Reconciliation API Test", () => {
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
            test("Add new Bank Reconciliation", async ({ api }) => {
                apiObj.setUrl(
                    `${accUrl}/api/BankRecon?form=%27BANKRECON%27&Environment=qaa&AttachmentID=""`
                );

                const payloadToSend = JSON.parse(JSON.stringify(basePayloads));

                payloadToSend.BankStateDate = currentDate.toISOString();
                payloadToSend.BeginningBal = createValues[0];
                payloadToSend.EndingBal = createValues[1];
                payloadToSend.OUCode = createValues[2];

                const { HdrKey, status, json } = await apiObj.create(
                    payloadToSend,
                    {
                        HdrKey: "BankReconHdrKey",
                    }
                );

                expect([200, 201]).toContain(status);
                createdRecord = json;
                
                BankReconHdrKey = HdrKey;
            });

            // GET BY KEY
            test("Get Bank Reconciliation by HdrKey", async ({ api }) => {
                const keyToUse = BankReconHdrKey || savedKey;
                apiObj.setUrl(`${accUrl}/odata/BankReconHdr?BankReconHdrKey=${keyToUse}&$format=json`);
                await apiObj.getByKey();
            });
            
            // GET ALL
            test("Get all Bank Reconciliation", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/BankReconHdr?$format=json&$orderby=BankCode%20asc,BankStateDate%20desc,BankReconHdrKey&$select=BankReconHdrKey,BankStateDate,BankCode,BeginningBal,EndingBal,OUCode,GLStatusDesc,CreatedByCode,UpdatedByCode,IsContainAttach,IsSelect&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=OUCode%20eq%20%27UMBB%27`
            );
                await apiObj.getAll();
            });

            // UPDATE
            test("Update Bank Receipt", async ({ api }) => {
                const keyToUse = BankReconHdrKey || savedKey;
                expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
                              
                apiObj.setUrl(`${accUrl}/api/BankRecon?form=%27BANKRECON%27&Environment=qaa&AttachmentID=""`);
                // --- UPDATE PAYLOAD  ---
            
                // Use the captured 'createdRecord' to build update payload.
                const updatePayload = JSON.parse(JSON.stringify(createdRecord));
            
                // Apply changes to the main header fields.
                updatePayload.BankReconHdrKey = keyToUse;
                updatePayload.BeginningBal = editValues[0];
                updatePayload.EndingBal = editValues[1];
                updatePayload.UpdatedDate = currentDate.toISOString();
                updatePayload.RowState = 2; 
                
                // --- END OF PAYLOAD ---
                            
                const { status, json } = await apiObj.update("POST", updatePayload);
                            
                expect(status).toBe(200);
            });

            test("Delete Bank Reconciliation", async ({ api }) => {
                const keyToUse = BankReconHdrKey || savedKey;
            
                apiObj.setUrl(`${accUrl}/api/BankRecon?key=${keyToUse}`);
            
                await apiObj.delete();
            });
    })
})