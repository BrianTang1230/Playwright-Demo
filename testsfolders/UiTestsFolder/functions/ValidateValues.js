async function ValidateUiValues(inputValues, uiValues) {
  for (let i = 0; i < inputValues.length; i++) {
    if (inputValues[i] === "NA") continue;
    if (inputValues[i] !== uiValues[0][i]) {
      console.error(
        `UI validation failed at index ${i}: ${inputValues[i]} !== ${uiValues[0][i]}`
      );
      return false;
    }
    console.log(
      `UI validation succeeded at index ${i}: ${inputValues[i]} === ${uiValues[0][i]}`
    );
  }
  return true;
}

async function ValidateDBValues(inputValues, inputCols, dbValues) {
  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element to be colName
    const colName = inputCols[i].split(" ")[0];

    if (inputValues[i] === "NA") continue;
    if (dbValues[colName] !== inputValues[i]) {
      console.error(
        `DB validation failed at index ${i}: ${dbValues[colName]} !== ${inputValues[i]}`
      );
      return false;
    }
    console.log(
      `DB validation succeeded at index ${i}: ${dbValues[colName]} === ${inputValues[i]}`
    );
  }
  return true;
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
        console.error(
          `Grid validation failed at cell ${gCells[j]}: ${inputValue} !== ${value}`
        );
        return false;
      }
      console.log(
        `Grid validation succeeded at cell ${gCells[j]}: ${inputValue} === ${value}`
      );
    }
  }
  return true;
}

module.exports = { ValidateUiValues, ValidateDBValues, ValidateGridValues };
