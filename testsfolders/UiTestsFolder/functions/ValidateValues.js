async function ValidateUiValues(inputValues, uiValues) {
  for (let i = 0; i < inputValues.length; i++) {
    if (inputValues[i] === "NA") continue;
    if (inputValues[i] !== uiValues[0][i]) {
      throw new Error(
        `Mismatch UI values: ${inputValues[i]} !== ${uiValues[0][i]}`
      );
    }
  }
}

async function ValidateDBValues(inputValues, inputCols, dbValues) {
  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element to be colName
    const colName = inputCols[i].split(" ")[0];

    if (inputValues[i] === "NA") continue;
    if (dbValues[colName] !== inputValues[i]) {
      throw new Error(
        `Mismatch DB values: ${inputValues[i]} !== ${dbValues[colName]}`
      );
    }
  }
}

async function ValidateGridValues(page, gValues, gPaths, gCells) {
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
      }
    }
  }
}

module.exports = { ValidateUiValues, ValidateDBValues, ValidateGridValues };
