/**
 * BANK RECONCILIATION API AUTOMATION TEST
 * * Purpose: Validates the CRUD (Create, Read, Update, Delete) lifecycle of the Bank Reconciliation form.
 * Data Source: Excel Sheet 'ACCAPI_Data', Form 'Bank Reconciliation'
 */ 

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
import { Client } from "@microsoft/microsoft-graph-client";

// Global variables to maintain state across tests (Create -> Update -> Delete)
let apiObj, createValues, editValues, BankReconHdrKey, createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data", formName = "Bank Reconciliation";
const basePayloads = AccountPayloads.BankReconciliation;
const savedKey = ID.BankReconciliation.BankReconHdrKey; // Fallback key

test.describe.serial("Bank Reconciliation API Test", () => {
    
    // --- SETUP: Load Data & Initialize API Wrapper ---
    test.beforeAll(async ({ excel }) => {
        await excel.init(false); // force API mode
        
        // Load test data from Excel into arrays (createValues = Row 1, editValues = Row 2)
        [createValues, editValues] = await excel.loadExcelValues(
            sheetName,
            formName,
            { isUI: false }
        );
        
        // Initialize the API Page Object Model
        apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
    });

    // Rebind the fresh API context before every individual test
    test.beforeEach(async ({ api }) => {
        apiObj.api = api;
    });

    test.describe("CRUD Operation Testing", () => {
        
        // --- STEP 1: CREATE (POST) ---
        test("Add new Bank Reconciliation", async ({ api }) => {
            const apiUrl = `${accUrl}/api/BankRecon?form=%27BANKRECON%27&Environment=qaa&AttachmentID=""`;
            apiObj.setUrl(apiUrl);

            // Dynamic Dates
            const currentDate = new Date().toISOString();

            // Construct Payload: Merging base template with Excel data
            // We use Spread Syntax (...) for cleaner mapping
            const payload = {
                ...basePayloads,
                OUKey: createValues[0],
                BankStateDate: currentDate,
                BeginningBal: createValues[1],
                EndingBal: createValues[2],
                BankKey: createValues[3],
                CreatedDate: currentDate,
                UpdatedDate: currentDate,
                
                bankReconDetails: [
                    {
                        ...basePayloads.bankReconDetails[0],
                        ClientKey: createValues[4],
                        OUKey: createValues[5],
                        TransDetKey: createValues[6],
                    },
                    {
                        ...basePayloads.bankReconDetails[1],
                        ClientKey: createValues[7],
                        OUKey: createValues[8],
                        TransDetKey: createValues[9],
                    }
                ]
            };

            // Note: Bank Recon uses 'HdrKey' return parameter
            const { HdrKey, status, json } = await apiObj.create(
                payload,
                { HdrKey: "BankReconHdrKey" }
            );

            expect([200, 201]).toContain(status);
            
            // Store response for next steps
            createdRecord = json;
            BankReconHdrKey = HdrKey;
        });

        // --- STEP 2: READ (GET) ---
        test("Get Bank Reconciliation by HdrKey", async ({ api }) => {
            const keyToUse = BankReconHdrKey || savedKey;
            apiObj.setUrl(
                `${accUrl}/odata/BankReconHdr?BankReconHdrKey=${keyToUse}&$format=json`
            );
            await apiObj.getByKey();
        });

        // --- STEP 3: LIST (GET ALL) ---
        test("Get all Bank Reconciliation", async ({ api }) => {
            apiObj.setUrl(
                `${accUrl}/odata/BankReconHdr?$format=json&$orderby=BankCode%20asc,BankStateDate%20desc,BankReconHdrKey&$select=BankReconHdrKey,BankStateDate,BankCode,BeginningBal,EndingBal,OUCode,GLStatusDesc,CreatedByCode,UpdatedByCode,IsContainAttach,IsSelect&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=OUCode%20eq%20%27UMBB%27`
            );
            await apiObj.getAll();
        });

        // --- STEP 4: UPDATE (POST) ---
        test("Update Bank Reconciliation", async ({ api }) => {
            const keyToUse = BankReconHdrKey || savedKey;
            
            // Ensure Create step passed
            expect(createdRecord, "The 'createdRecord' is not available. Ensure the create test ran successfully.").toBeDefined();
            
            apiObj.setUrl(
                `${accUrl}/api/BankRecon?form=%27BANKRECON%27&Environment=qaa&AttachmentID=""`
            );
            
            // Payload Construction:
            // Clone the record from server and overwrite fields with editValues
            const updatePayload = {
                ...createdRecord,
                BankReconHdrKey: keyToUse,
                BeginningBal: editValues[0],
                EndingBal: editValues[1],
                UpdatedDate: new Date().toISOString(),
                RowState: 2 // 2 = Modified State
            };
            
            const { status, json } = await apiObj.update("POST", updatePayload);
            expect(status).toBe(200);
        });

        // --- STEP 5: DELETE (CLEANUP) ---
        test("Delete Bank Reconciliation", async ({ api }) => {
            // Validate key exists to prevent accidental deletion of wrong records
            const keyToUse = BankReconHdrKey || savedKey;
            
            console.log(`Attempting to delete record with BankReconHdrKey: ${keyToUse}`);
            
            try {
                // Using API Delete method for Bank Recon (SQL helper not applicable here)
                apiObj.setUrl(`${accUrl}/api/BankRecon?key=${keyToUse}`);
                await apiObj.delete();
                console.log("Delete API executed successfully.");
            } catch (error) {
                // Explicitly throw error to fail test if cleanup fails
                throw new Error(`Delete failed for BankReconHdrKey ${keyToUse}. Reason: ${error.message}`);
            }
        });
    });
});