export default async function InputValues(page, path, col, value) {
  col = col.toLowerCase();

  if (value == "NA") {
    return;
  }

  if (!path.startsWith("#") && !path.startsWith("//")) {
    path = `[name='${path}']`;
  }

  // Checkbox Input
  if (col.includes("checkbox")) {
    if (value.toLowerCase() == "true") await page.locator(path).check();
    else await page.locator(path).uncheck();
    return;
  }

  // Integer,Date,Text Input
  if (col.includes("numeric")) {
    await page.locator(path).fill(value);
    return;
  }
  if (col.includes("date")) {
    await page.locator(path).fill(value);
    return;
  }
  if (col.includes("text")) {
    await page.locator(path).fill(value);
    return;
  }

  // Dropdown Input
  if (col.includes("dropdown")) {
    await page.locator(path).selectOption(value);
    return;
  }
}
