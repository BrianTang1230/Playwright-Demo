export default async function InputValues(page, path, col, value) {
  col = col.toLowerCase();

  // Checkbox Input
  if (col.contains("checkbox")) {
    if (value) await page.check(path);
    else await page.uncheck(path);
  }

  // Integer Input
  if (col.contains("number")) {
    await page.fill(path, value);
  }

  // Date Input
  if (col.contains("date")) {
    await page.fill(path, value);
  }

  if (col.contains("textbox")) {
    await page.fill(path, value);
  }
}
