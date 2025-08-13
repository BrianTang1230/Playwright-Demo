export default async function navigateToForm(
  page,
  module,
  formName,
  submodule
) {
  // Click to open Side Menu
  await page.click("a#moduleMenuToggleBtn-2");

  // Click to open Module
  await page.locator(`//a[@id='side${module}']`).click();

  // Click to open Submodule (if exists)
  if (submodule !== null)
    await page.locator(`//a[@id='dropDown${module + submodule}']`).click();

  // Click to open Form
  await page.locator(`//a[@id='side${formName}']`).click();
}
