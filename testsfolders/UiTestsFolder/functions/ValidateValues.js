import { parse } from "path";
import Data from "@utils/data/uidata/loginData.json";

const region = process.env.REGION || Data.Region;

export async function ValidateUiValues(inputValues, columns, uiValues) {
  for (let i = 0; i < inputValues.length; i++) {
    if (
      inputValues[i] === "NA" ||
      inputValues[i] === "AF" ||
      uiValues[i] === "NA"
    )
      continue;
    if (columns[i].includes("numeric")) {
      const inpVal = normalizeNumber(String(inputValues[i]));
      const uiVal = normalizeNumber(String(uiValues[i]));
      inputValues[i] = String(inpVal);
      uiValues[i] = String(uiVal);
    }
    if (inputValues[i].trim() !== String(uiValues[i]).trim()) {
      throw new Error(
        `Mismatch UI values of ${columns[i]}: ${inputValues[i]} !== ${uiValues[i]}`
      );
    } else {
      console.log(
        `Matched UI values of ${columns[i]}: ${inputValues[i]} === ${uiValues[i]}`
      );
    }
  }
}

export async function ValidateDBValues(inputValues, inputCols, dbValues) {
  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];

    if (inputValues[i] === "NA") continue;
    if (inputCols[i].includes("numeric")) {
      inputValues[i] = normalizeNumber(inputValues[i]);
    }

    if (String(inputValues[i]).trim() !== String(dbValues[colName]).trim()) {
      throw new Error(
        `Mismatch DB values of ${colName}: ${inputValues[i]} !== ${dbValues[colName]}`
      );
    } else {
      console.log(
        `Matched DB values of ${colName}: ${inputValues[i]} === ${dbValues[colName]}`
      );
    }
  }
}

export async function ValidateGridValues(eValues, gValues) {
  if (eValues.length !== gValues.length) {
    throw new Error("Mismatch length in Grid values.");
  }

  for (let i = 0; i < gValues.length; i++) {
    let expected = eValues[i];
    let actual = gValues[i];

    if (expected === "NA" || actual === "NA") continue;

    if (!isNaN(normalizeNumber(expected))) {
      actual = normalizeNumber(actual).toString();
      expected = normalizeNumber(expected).toString();
    }

    if (actual === expected) {
      console.log(`Matched Grid values: ${actual} === ${expected}`);
    } else {
      throw new Error(`Mismatch Grid values： ${actual} !== ${expected}.`);
    }
  }
}

function normalizeNumber(raw) {
  let cleaned = raw;
  if (region === "MY") {
    cleaned = cleaned.replaceAll(",", "");
  } else if (region === "IND") {
    cleaned = cleaned.replaceAll(".", "").replace(",", ".");
  }
  return Number(cleaned);
}
