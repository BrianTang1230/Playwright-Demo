import GetElementByPath from "./GetElementByPath";

async function ValidateValues(page, values, paths) {
  for (let i = 0; i < paths.length; i++) {
    const inputPath = await GetElementByPath(page, paths[i]);

    // if checkbox
    if ((await inputPath.getAttribute("type")) === "checkbox") {
      const isChecked = await inputPath.isChecked();
      if (
        (values[i] === "True" && isChecked) ||
        (values[i] === "False" && !isChecked)
      ) {
        console.debug(`Validating ${isChecked.toString()} === ${values[i]}`);
        continue;
      } else {
        return false;
      }
    } else {
      const inputValue = await inputPath.inputValue();
      if (values[i] === "NA") continue;
      console.debug(`Validating ${inputValue} === ${values[i]}`);
      if (inputValue.toString().trim() !== values[i].trim()) return false;
    }
  }
  return true;
}

async function ValidateGridValues(page, gValue, gPath, gCells) {
  const table = page.locator(gPath);
  const row = table.locator("tr").first();

  for (let j = 0; j < gCells.length; j++) {
    const cell = row.locator("td").nth(gCells[j]);
    const value = gValue.split(",")[j];

    const inputValue = await cell.innerText();
    if (value === "NA") continue;
    console.debug(`Validating ${inputValue} === ${value}`);
    if (inputValue.toString().trim() !== value.trim()) return false;
  }

  return true;
}

module.exports = { ValidateValues, ValidateGridValues };
