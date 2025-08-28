import { parse } from "path";

export async function ValidateUiValues(inputValues, columns, uiValues) {
  for (let i = 0; i < inputValues.length; i++) {
    if (inputValues[i] === "NA") continue;
    if (uiValues[0][i].includes(",") && columns[i].includes("numeric")) {
      uiValues[0][i] = uiValues[0][i].replace(/,/g, "");
    }
    if (columns[i].includes("numeric")) {
      uiValues[0][i] = parseFloat(uiValues[0][i]);
      inputValues[i] = parseFloat(inputValues[i]);
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
    // Columns split by space and get the first element to be colName
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
