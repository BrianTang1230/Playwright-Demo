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
const formName = "Creditor Payment";
const basePayloads = AccountPayloads.CreditorPayment;
const savedKey = ID.CreditorPayment.TransHdrKey;
const savedDocNo = ID.CreditorPayment.num;