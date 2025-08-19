import GetElementByPath from "./GetElementByPath";

export default async function getValues(
  page,
  paths,
  gridPaths = [],
  cellsIndex = []
) {
  const uiValues = [];
  const gridValues = [];
  for (let i = 0; i < paths.length; i++) {
    const inputPath = await GetElementByPath(page, paths[i]);

    // if checkbox
    if ((await inputPath.getAttribute("type")) === "checkbox") {
      const isChecked = await inputPath.isChecked();
      isChecked ? uiValues.push("True") : uiValues.push("False");
    } else {
      const inputValue = await inputPath.inputValue();
      if (inputValue === "") {
        uiValues.push("NA");
      } else {
        uiValues.push(inputValue.trim());
      }
    }
  }
  if (gridPaths.length > 0 && cellsIndex.length > 0) {
    for (let i = 0; i < gridPaths.length; i++) {
      const table = page.locator(gridPaths[i]);
      const row = table.locator("tr").first();

      for (let j = 0; j < cellsIndex.length; j++) {
        const cell = row.locator("td").nth(cellsIndex[j]);

        const gridValue = await cell.innerText();
        if (gridValue === "") {
          gridValues.push("NA");
        } else {
          gridValues.push(gridValue.trim());
        }
      }
    }
  }
  return [uiValues, gridValues];
}
