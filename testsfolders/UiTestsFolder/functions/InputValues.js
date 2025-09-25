import GetElementByPath from "./GetElementByPath";

export async function InputValues(page, path, col, value) {
  if (value == "NA") {
    return;
  }

  col = col.toLowerCase();
  const element = await GetElementByPath(page, path);

  if (col.includes("k-drop")) {
    await element.first().click();
    await page
      .locator(`${path}_listbox li`, { hasText: value })
      .first()
      .click();
  }

  // Checkbox Input
  if (col.includes("checkbox")) {
    if (value.toLowerCase() == "true") await element.check();
    else await element.uncheck();
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

  for (let j = 0; j < cellsIndex.length; j++) {
    const cell = row.locator("td").nth(cellsIndex[j]);

    await cell.click();
    const value = values.split(";")[j];
    if (value === "NA") return;

    const input = cell.locator("input").first();
    editing && (await input.fill(""));
    await input.type(value);
    await input.press("ArrowDown");
    await input.press("Enter");
  }
}
