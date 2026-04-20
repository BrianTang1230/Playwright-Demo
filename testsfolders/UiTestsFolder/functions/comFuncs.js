import { allure } from "allure-playwright";

export async function checkLength(paths, columns, createValues, editValues) {
  if (
    paths.length !== columns.length ||
    columns.length !== createValues.length ||
    createValues.length !== editValues.length
  ) {
    console.error(
      paths,
      paths.length,
      columns,
      columns.length,
      createValues,
      createValues.length,
      editValues,
      editValues.length,
    );
    throw new Error("Paths, columns, and values do not match in length.");
  }
}

export async function SelectOU(page, inputPath, dropdownPath, ou) {
  await page.waitForSelector(inputPath);
  await page.locator(inputPath).first().click();
  await page.locator(dropdownPath, { hasText: ou }).first().click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function runStep(stepName, callback) {
  return await allure.step(stepName, async () => {
    return await callback();
  });
}

export async function GetElementByPath(page, path) {
  let element;
  // If path starts with # or //, use .locator directly
  if (path.startsWith("#") || path.startsWith("//")) {
    element = page.locator(path).first();
  }

  // If path does not start with # or // and includes *, use .getByRole
  else if (path.includes("*")) {
    let role = path.split("*");

    // If role[1] is not a number lets find the element by name, else find by index
    if (role[1] || role[1].trim() !== "") {
      if (isNaN(Number(role[1]))) {
        element = page.getByRole(role[0], { name: role[1] }).first();
      } else element = page.getByRole(role[0]).nth(Number(role[1])).first();
    }
  } else {
    // If path does not start with any symbols, use .locator with name
    element = page.locator(`[name='${path}']`).first();
  }
  return element;
}
