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
let BPHdrKey, DocNum;
const currentDate = new Date();

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Bank Bulk Payment";
const basePayloads = AccountPayloads.BankBulkPayment;
const savedKey = ID.BankBulkPayment.key;
const savedDocNo = ID.BankBulkPayment.num;

test.describe.serial("Bank Bulk Payment API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // Force API mode
    [createValues, editValues] = await excel.loadExcelValues(
      sheetName,
      formName,
      { isUI: false }
    );

    apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    apiObj.api = api;
  });

  test.describe("CRUD Operation Testing", () => {
    // CREATE
    test("Add new Bank Bulk Payment", async ({ api }) => {
      apiObj.setUrl(`${accUrl}/api/BP`);
      
      const placeholderDate = `${currentDate}T00:00:00`;
      const { key, num, status, json } = await apiObj.create(
        {
          ...basePayloads,
          OUCode: createValues[0],
          BPDate: currentDate.toISOString(),
          Status: createValues[1],
          BankCode: createValues[2],
          BankName: createValues[3],
          CurrCode: createValues[4],
          CreatedDate: currentDate.toISOString(),
          UpdatedDate: currentDate.toISOString(),
          ApprovedDate: currentDate.toISOString(),
          VoidDate: currentDate.toISOString(),
          bpDetails: [
            {
              TransHdrKey: createValues[5],
              TransDetKey: createValues[6],
              OUCode: createValues[7],
              CurrCode: createValues[8],
              PymtType: createValues[9],
              PymtTypeid: createValues[10],
              GLDate: createValues[11],
              GLDesc: createValues[12],
              BeneficiaryName: createValues[13],
              BankAccNum: createValues[14],
              PaymentAmt: createValues[15],
              BankName: createValues[16],
              Email: createValues[17],
            }]
        },
        {
          key: "BPHdrKey",
          num: "DocNum",
        }
      );
      expect(status).toBe[(200, 201)];

      BPHdrKey = key;
      DocNum = num;
    });

    // GET BY KEY
    test("Get Bank Bulk Payment by HdrKey", async ({ api }) => {
      const keyToUse = BPHdrKey || savedKey;

      apiObj.setUrl(
        `${accUrl}/odata/BPHeader?$filter=BPHdrKey eq ${keyToUse}&$format=json`
      );
      await apiObj.getByKey();
    });

    // GET ALL
    test("Get all Bank Bulk Payment transactions", async ({ api }) => {
      apiObj.setUrl(
        `${accUrl}/odata/BPHeader?$format=json&$orderby=BPDate desc,BPHdrKey&$select=BPHdrKey,OUCode,DocNum,BPDate,BankCode,BankName,CurrCode&$inlinecount=allpages&$top=20&$filter=OUCode eq 'UMBB'`
      );
      await apiObj.getAll();
    });

    test("Update Bank Bulk Payment transaction", async ({ api }) => {
      const keyToUse = BPHdrKey || savedKey;      // Header key to update
      const docNoToUse = DocNum || savedDocNo;    // Doc number to update
    
          apiObj.setUrl(`${accUrl}/api/BP`);

          const { status, json } = await apiObj.update("POST", {
            ...basePayloads,
            BPHdrKey: keyToUse,
            DocNum: docNoToUse,
            OUCode: editValues[0],
            Status: editValues[1],
            BankCode: editValues[2],
            BankName: editValues[3],
            CurrCode: editValues[4],
            BPDate: currentDate.toISOString(),
            ApprovedDate: currentDate.toISOString(),
            VoidDate: currentDate.toISOString(),
            RowState: 2,
            bpDetails: [
            {
              BPHdrKey: keyToUse,
              TransHdrKey: editValues[5],
              TransDetKey: editValues[6],
            }]  
        });     
  });
      
    test("Delete Bank Bulk Payment transaction", async ({ api }) => {
      const keyToUse = BPHdrKey || savedKey;

      const deleteUrl = `${accUrl}/api/BP/Delete?BPHdrKey=${keyToUse}`;

      const response = await api.post(deleteUrl, {
          headers: {
            "Content-Type": "application/json",
          },
      });

        const status = response.status();
        let json = {};
        try {
          json = await response.json();
        } catch {
          console.log("No JSON response (204 No Content)");
        }

        console.log("Delete Response:", json);

        // Expect successful delete
        expect([200, 204]).toContain(status);

        if (status === 200 && json?.Message) {
          console.log(json.Message);
        } else {
          console.log("Bank Bulk Payment deleted successfully.");
        }
      });
  });
});
