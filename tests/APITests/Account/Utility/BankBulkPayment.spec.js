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
let createValues;
let BPHdrKey, DocNum;
const currentDate = new Date().toISOString().split("T")[0];

const accUrl = ACC_API_URL;
const sheetName = "ACCAPI_Data";
const formName = "Bank Bulk Payment";
const basePayloads = AccountPayloads.BankBulkPayment;
const savedKey = ID.BankBulkPayment.key;
const savedDocNo = ID.BankBulkPayment.num;

test.describe.serial("Bank Bulk Payment API Test", () => {
  test.beforeAll(async ({ excel }) => {
    await excel.init(false); // Force API mode
    [createValues] = await excel.loadExcelValues(sheetName, formName, {
      isUI: false,
    });

    apiObj = new ApiCallBase(null, "", formName, AccountJsonPath);
  });

  test.beforeEach(async ({ api }) => {
    apiObj.api = api;
  });

  test.describe("CRUD Operation Testing", () => {
    // 🟢 CREATE
    test("Add new Bank Bulk Payment", async ({ api }) => {
      apiObj.setUrl(`${accUrl}/api/BP`);
      
      const placeholderDate = "1900-01-01T00:00:00";
      const { key, num, status, json } = await apiObj.create(
        {
          OUKey: parseInt(createValues[0]) || 1,
          OUCode: createValues[1] || null,
          BPDate: `${currentDate}T00:00:00`,
          Status: "OP",
          BankKey: parseInt(createValues[2]) || 26,
          CurrCode: createValues[3] || "MYR",
          CreatedBy: 2841,
          CreatedDate: currentDate,
          UpdatedBy: 2841,
          UpdatedDate: currentDate,
          ApprovedBy: -1,
          ApprovedDate: currentDate,
          VoidBy: -1,
          VoidDate: `${currentDate}T00:00:00`,
          Reason: createValues[4] || "Initial bulk payment",
          RowState: 1,
          bpDetails: [
            {
              TransHdrKey: 477663,
              CurrCode: "MYR",
              PymtType: "IBG",
              BeneficiaryName: "AMR SONS (MALAYSIA) SDN. BHD.",
              BankAccNum: "554044512659",
              PaymentAmt: 660,
              RowState: 1,
            },
          ],
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

    // 🔍 GET BY KEY
    test("Get Bank Bulk Payment by HdrKey", async ({ api }) => {
      const keyToUse = BPHdrKey || savedKey;

      apiObj.setUrl(
        `${accUrl}/odata/BPHeader?$filter=BPHdrKey eq ${keyToUse}&$format=json`
      );
      await apiObj.getByKey();
    });

    // 🔍 GET ALL
    test("Get all Bank Bulk Payment transactions", async ({ api }) => {
      apiObj.setUrl(
        `${accUrl}/odata/BPHeader?$format=json&$orderby=BPDate desc,BPHdrKey&$select=BPHdrKey,OUCode,DocNum,BPDate,BankCode,BankName,CurrCode&$inlinecount=allpages&$top=20&$filter=OUCode eq 'UMBB'`
      );
      await apiObj.getAll();
    });

    /* test("Update Bank Bulk Payment transaction", async ({ api }) => {
      const keyToUse = BPHdrKey || savedKey;      // Header key to update
      const docNoToUse = DocNum || savedDocNo;    // Doc number to update
    
          apiObj.setUrl(`${accUrl}api/BP`);
    
          const updatedDetails = [
          {
            BPDetKey: 64697,
            BPHdrKey: keyToUse,
            TransHdrKey: 443644,
            TransDetKey: 4326829,
            ClientKey: -1,
            OUKey: -1,
            OUCode: "",
            DocNum: "BV24010006",
            CurrCode: "",
            PymtType: "IBG",
            PymtTypeid: 10,
            GLDate: "2024-01-03T16:00:00Z",
            GLDesc: "<HO>RENTAL FOR CHAIRPERSON OFFICE - JANUARY 2024",
            BeneficiaryName: "NIRA SDN BHD",
            BankAccNum: "8000866934",
            PaymentAmt: 8000.0,
            BankName: "CIMB Bank Berhad",
            ICNO: "",
            BRNO: "",
            PoliceArmyPassNO: "",
            Email: "dummy@dummy.com",
            PurposeCode: "",
            PurposeCodeText: "",
            RowState: 1
          }
        ];
            const { status, json } = await apiObj.update("POST", {
              ...basePayloads,        // Keep all existing values
              BPHdrKey: keyToUse,
              DocNum: docNoToUse,
              RowState: 2,            // Update header RowState if needed
              bpDetails: updatedDetails
          });
            // Expect a successful update
            expect(status).toBe(200);
            console.log("Update response:", json);
        });*/
  });
});
