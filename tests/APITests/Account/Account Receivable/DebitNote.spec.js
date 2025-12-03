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
const formName = "Debit Note";
const basePayloads = AccountPayloads.DebitNote;
const savedKey = ID.DebitNote.TransHdrKey;
const savedDocNo = ID.DebitNote.num;

test.describe.serial("Debit Note API Test", () => {
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

    test("Add new Debit Note", async ({ api }) => {
        // 1. Set URL
        const apiUrl = `${accUrl}/api/GL?form=%27DN%27&Environment=qaa&AttachmentID=""&InterCompTransHdrKey=0`;
        apiObj.setUrl(apiUrl);

        // 2. Build Payload
        const payloadToSend = JSON.parse(JSON.stringify(basePayloads));

        // 3. Send Request
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
});