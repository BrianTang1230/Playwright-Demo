export default async function InputValues(page, path, col, value) {
  col = col.toLowerCase();

  // Checkbox Input
  if (col.includes("checkbox")) {
    if (value.toLowerCase() == "true") await page.check(path);
    else await page.uncheck(path);
  }

  // Integer,Date,Text Input
  if (col.includes("numeric")) {
    await page.locator(path).fill(parseInt(value));
  }
  if (col.includes("date")) {
    await page.locator(path).fill(value);
  }
  if (col.includes("text")) {
    await page.locator(path).fill(value);
  }

  // Dropdown Input
  if (col.includes("dropdown")) {
    await page.selectOption(path, value);
  }
}
