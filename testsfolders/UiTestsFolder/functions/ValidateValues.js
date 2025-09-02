import { parse } from "path";
import Data from "@utils/data/uidata/loginData.json";

export async function ValidateUiValues(inputValues, columns, uiValues) {
  for (let i = 0; i < inputValues.length; i++) {
    if (inputValues[i] === "NA") continue;
    if (columns[i].includes("numeric")) {
      console.log(uiValues[0][i]);
      const uiVal = normalizeNumber(uiValues[0][i]);
      console.log(uiVal);
      uiValues[0][i] = uiVal;
    }
    if (inputValues[i] !== uiValues[0][i]) {
      throw new Error(
        `Mismatch UI values: ${inputValues[i]} !== ${uiValues[0][i]}`
      );
    } else {
      console.log(`Matched UI values: ${inputValues[i]} === ${uiValues[0][i]}`);
    }
  }
}

export async function ValidateDBValues(inputValues, inputCols, dbValues) {
  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];

    if (inputValues[i] === "NA") continue;
    if (inputCols[i].includes("numeric")) {
      inputValues[i] = parseInt(inputValues[i]);
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

export async function ValidateGridValues(page, gValues, gPaths, gCells) {
  for (let i = 0; i < gPaths.length; i++) {
    const table = page.locator(gPaths[i]);
    const row = table.locator("tr").first();

    for (let j = 0; j < gCells.length; j++) {
      const cell = row.locator("td").nth(gCells[j]);
      const value = gValues[1][j];

      const inputValue = await cell.innerText();
      if (value === "NA") continue;
      if (inputValue.toString().trim() !== value.trim()) {
        throw new Error(`Mismatch Grid values: ${inputValue} !== ${value}`);
      } else {
        console.log(`Matched Grid values: ${inputValue} === ${value}`);
      }
    }
  }
}

function normalizeNumber(raw) {
  let cleaned = raw;

  if (Data.Region === "MY") {
    cleaned = cleaned.replace(",", "");
    return parseFloat(cleaned).toString();
  } else {
    cleaned = cleaned.replace(".", "").replace(",", ".");
    return parseFloat(cleaned).toString();
  }
}
