import GetElementByPath from "./GetElementByPath";

export async function InputValues(page, path, col, value) {
  if (value == "NA") {
    return;
  }

  col = col.toLowerCase();
  const element = await GetElementByPath(page, path);
  if (!element) throw new Error("Element not found");
  else await element.focus();

  if (col.includes("k-drop")) {
    await element.first().click();
    await page
      .locator(`${path}_listbox li`, { hasText: value })
      .first()
      .click();
  }

  // Checkbox Input
  else if (col.includes("checkbox")) {
    if (value.toLowerCase() === "true") {
      await element.check();
    } else if (value.toLowerCase() === "false") {
      await element.uncheck();
    }
  }

  // Button Input
  else if (col.includes("button")) {
    await element.click();
  }

  // Integer,Date,Text Input
  else if (col.includes("text") || col.includes("date")) {
    await element.fill(value);
    await element.press("Enter");
  }

  // Numeric Input
  else if (col.includes("numeric")) {
    await element.press("Backspace");
    await element.type(value);
  }

  // All elements which have dropdown menu
  else if (col.includes("dropdown")) {
    await element.fill("");
    await element.type(value);
    await element.press("Enter");
  }

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function InputGridValuesSameCols(
  page,
  path,
  values,
  cellsIndex,
  nRow = 0
) {
  const table = page.locator(path);
  const vals = values.split(";");
  const row = table.locator("tr").nth(nRow);

  for (let i = 0; i < cellsIndex.length; i++) {
    if (vals[i] === "NA") continue;
    const cell = row.locator('td').nth(cellsIndex[i]);

    await cell.click();

    const input = cell.locator("input").first();

    if (vals[i].toLowerCase() === "true") {
      await input.check();
      continue;
    } else if (vals[i].toLowerCase() === "false") {
      await input.uncheck();
      continue;
    }

    await input.press("Backspace");
    await input.type(vals[i]);
    await input.press("Enter");
  }
}
