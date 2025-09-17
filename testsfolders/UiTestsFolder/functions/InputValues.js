import GetElementByPath from "./GetElementByPath";

export async function InputValues(page, path, col, value) {
  if (value == "NA") {
    return;
  }

  col = col.toLowerCase();
  const element = await GetElementByPath(page, path);
  if (!element) throw new Error("Element not found");

  if (col.includes("k-drop")) {
    await element.first().click();
    await page
      .locator(`${path}_listbox li`, { hasText: value })
      .first()
      .click();
  }

  // Checkbox Input
  if (col.includes("checkbox")) {
    await setCheckboxOrSwitch(element, value.toLowerCase() === "true");
    return;
  }

  // Button Input
  if (col.includes("button")) {
    await element.click();
    return;
  }

  // Integer,Date,Text Input
  if (col.includes("text") || col.includes("date")) {
    await element.fill(value);
    return;
  }

  // Numeric Input
  if (col.includes("numeric")) {
    await element.fill("");
    await element.type(value);
    return;
  }

  // All elements which have dropdown menu
  if (col.includes("dropdown")) {
    await element.fill("");
    await element.type(value);
    await element.press("Enter");
    return;
  }
}

export async function InputGridValues(
  page,
  path,
  values,
  cellsIndex,
  editing = false
) {
  const table = page.locator(path);
  const row = table.locator("tr").first();
  let valIndex = 0;

  for (let i = 0; i < cellsIndex.length; i++) {
    const cell = row.locator("td").nth(cellsIndex[i]);

    await cell.click();
    const value = values.split(";")[i];
    if (value === "NA") return;

    const input = cell.locator("input").first();
    editing && (await input.fill(""));
    await input.type(value);
    await input.press("ArrowDown");
    await input.press("Enter");
  }
}
