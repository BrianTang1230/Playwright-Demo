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
let UnculAreaHdrKey;
const currentDate = new Date();
const dueDate = new Date(currentDate);
dueDate.setDate(dueDate.getDate() + 30);

// Declare a variable to hold the state of the created record.
let createdRecord;

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Uncultivated Area";
const basePayloads = AccountPayloads.UncultivatedArea;
const savedKey = ID.UncultivatedArea.UnculAreaHdrKey;

test.describe.serial("Uncultivated Area API Test", () => {
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

    test("Add new Uncultivated Area", async ({ api }) => {
        // 1. Set URL
        const apiUrl = `${accUrl}/api/UnculAreaFIN?form=%27UNCULAREA%27&Environment=qaa&AttachmentID=""`;
        apiObj.setUrl(apiUrl);

        // 2. Build Payload
        const payloadToSend = JSON.parse(JSON.stringify(basePayloads));
        payloadToSend.OUKey = createValues[0];
        payloadToSend.Remark = createValues[1];
        payloadToSend.CreatedDate = currentDate.toISOString();
        payloadToSend.UpdatedDate = currentDate.toISOString();

        if (payloadToSend.addUnculAreaDetails && payloadToSend.addUnculAreaDetails[0]) {
            const detail1 = payloadToSend.addUnculAreaDetails[0];
            detail1.UnculAreaKey = createValues[2];
            detail1.UnculAreaCode = createValues[3];
            detail1.UnculAreaDesc = createValues[4];
            detail1.UnculAreaCodeDesc = createValues[5];
            detail1.Area = createValues[6];
        }

        // 3. Send Request
        const { key, num, status, json } = await apiObj.create(
            payloadToSend,
            {
                key: "UnculAreaHdrKey",
            }
        );

        expect([200, 201]).toContain(status);
        createdRecord = json;
        
        UnculAreaHdrKey = key;
    });

    // GET BY KEY
    test("Get Uncultivated Area by HdrKey", async ({ api }) => {
        const keyToUse = UnculAreaHdrKey || savedKey;
        apiObj.setUrl(
            `${accUrl}/odata/UnculAreaHdr?HdrKey=${keyToUse}&$format=json`
        );
            await apiObj.getByKey();
    });
                            
    // GET ALL
    test("Get all Uncultivated Area", async ({ api }) => {
        apiObj.setUrl(
            `${accUrl}/odata/UnculAreaHdr?$expand=addUnculAreaDetails&$format=json&$orderby=FY%20desc,Period%20asc,UnculAreaHdrKey&$select=UnculAreaHdrKey,OUCode,FY,DisplayYr,Period,Remark,DivCodeDesc,CreatedByCode,LastUpdatedByCode,IsContainAttach,IsSelect&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(FY%20eq%202026%20and%20Period%20eq%208)`
        );
        await apiObj.getAll();
    });

    // UPDATE 
    test("Update Uncultivated Area", async ({ api }) => {
        const keyToUse = UnculAreaHdrKey || savedKey;
        expect(createdRecord, "The 'createdRecord' is not available.").toBeDefined();
                
        apiObj.setUrl(
            `${accUrl}/api/UnculAreaFIN?form=%27UNCULAREA%27&Environment=qaa&AttachmentID=""`
        );
                
        // Update Payload
        // copy the record from the server
        const updatePayload = JSON.parse(JSON.stringify(createdRecord));
        updatePayload.UnculAreaHdrKey = keyToUse;
        updatePayload.Remark = editValues[0];
        updatePayload.RowState = 2;

        if (updatePayload.addUnculAreaDetails && updatePayload.addUnculAreaDetails[0]) {
            const detail1 = updatePayload.addUnculAreaDetails[0];
            detail1.ClientKey = editValues[1];
            detail1.Area = editValues[2];
        }

        if (updatePayload.addUnculAreaDetails && updatePayload.addUnculAreaDetails[1]) {
            const detail1 = updatePayload.addUnculAreaDetails[1];
            detail1.ClientKey = editValues[3];
            detail1.UnculAreaHdrKey = keyToUse;
            detail1.UnculAreaKey = editValues[4];
            detail1.UnculAreaCode = editValues[5];
            detail1.UnculAreaDesc = editValues[6];
            detail1.UnculAreaCodeDesc = editValues[7];
            detail1.Area = editValues[8];
        }

        // --- END OF PAYLOAD ---
                        
        const { status, json } = await apiObj.update("POST", updatePayload);
        
        expect(status).toBe(200);
    });

    test("Delete Uncultivated Area", async ({ api }) => {
        const keyToUse = UnculAreaHdrKey || savedKey;
    
        apiObj.setUrl(`${accUrl}/api/UnculAreaFIN?key=${keyToUse}`);
    
        await apiObj.delete();
    });    
});