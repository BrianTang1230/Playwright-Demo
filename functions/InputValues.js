export default async function InputValues(page, path, col, value) {
  if (value == "NA") {
    return;
  }

  col = col.toLowerCase();
  let element = null;

  // If path does not start with # or // and includes *, use getByRole
  if (!path.startsWith("#") && !path.startsWith("//") && path.includes("*")) {
    let role = path.slice(2).split("*");
    // If role[1] is not a number lets find the element by name; else find by index
    isNaN(parseInt(role[1]))
      ? (element = await page.getByRole(role[0], { name: role[1] }))
      : (element = await page.getByRole(role[0]).nth(parseInt(role[1])));
  } else {
    // If path starts with # or //, use locator directly
    element = await page.locator(path);
  }

  // Grid Input
  if (col === "grid") {
    await element.click();
    await element.getByRole("combobox").fill(value);
    return;
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
  if (col.includes("numeric") || col.includes("text") || col.includes("date")) {
    await element.fill(value);
    return;
  }

  // Dropdown Input
  if (col.includes("dropdown")) {
    await element.selectOption(value);
    return;
  }
}
