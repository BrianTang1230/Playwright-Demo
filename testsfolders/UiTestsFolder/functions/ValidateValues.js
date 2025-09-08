import { parse } from "path";
import Data from "@utils/data/uidata/loginData.json";

export async function ValidateUiValues(inputValues, columns, uiValues) {
  for (let i = 0; i < inputValues.length; i++) {
    if (inputValues[i] === "NA") continue;
    if (columns[i].includes("numeric")) {
      const uiVal = normalizeNumber(uiValues[i]).toString();
      uiValues[i] = uiVal;
    }
    if (inputValues[i] !== uiValues[i]) {
      throw new Error(
        `Mismatch UI values: ${inputValues[i]} !== ${uiValues[i]}`
      );
    } else {
      console.log(`Matched UI values: ${inputValues[i]} === ${uiValues[i]}`);
    }
  }
}

export async function ValidateDBValues(inputValues, inputCols, dbValues) {
  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];

    if (inputValues[i] === "NA") continue;
    if (inputCols[i].includes("numeric")) {
      inputValues[i] = Number(inputValues[i]);
      dbValues[i] = Number(dbValues[i]);
    }

    if (dbValues[colName] !== inputValues[i]) {
      throw new Error(
        `Mismatch DB values: ${inputValues[i]} !== ${dbValues[colName]}`
      );
    } else {
      console.log(
        `Matched DB values: ${inputValues[i]} === ${dbValues[colName]}`
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

    if (expected === "NA") continue;

    if (!isNaN(normalizeNumber(actual)) && !isNaN(normalizeNumber(expected))) {
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
  if (Data.Region === "MY") {
    cleaned = cleaned.replace(",", "");
    return parseFloat(cleaned);
  } else {
    cleaned = cleaned.replace(".", "").replace(",", ".");
    return parseFloat(cleaned);
  }
}
