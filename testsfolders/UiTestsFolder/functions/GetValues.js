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
    const tagName = (
      await inputPath.evaluate((el) => el.tagName)
    ).toLowerCase();
    const typeAttr = (await inputPath.getAttribute("type")) || "";

    // if checkbox
    if (typeAttr === "checkbox") {
      const isChecked = await inputPath.isChecked();
      isChecked ? uiValues.push("True") : uiValues.push("False");
    } else if (["input", "textarea", "select"].includes(tagName)) {
      const value = await inputPath.inputValue();
      uiValues.push(value && value.trim() !== "" ? value.trim() : "NA");
    } else {
      const text = await inputPath.innerText();
      uiValues.push(text && text.trim() !== "" ? text.trim() : "NA");
    }
  }
  
  if (gridPaths.length > 0 && cellsIndex.length > 0) {
    for (let i = 0; i < gridPaths.length; i++) {
      const table = page.locator(gridPaths[i]);
      const row = table.locator("tr").first();

      for (let j = 0; j < cellsIndex[i].length; j++) {
        const cell = row.locator("td").nth(cellsIndex[i][j]);
      
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
