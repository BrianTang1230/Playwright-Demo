export default async function navigateToForm(
  page,
  module,
  submodule,
  formName
) {
  // Click to open Side Menu
  await page.click("a#moduleMenuToggleBtn-2");

  // Click to open Module
  await page.getByRole("link", { name: ` ${module} ` }).click(); // use Pick Locator get the method

  // Click to open Submodule (if exists)
  if (submodule !== null)
    await page.locator(`//a[@id='dropDown${module + submodule}']`).click();

  // Click to open Form
  await page.locator(`//a[@id='side${formName}']`).click();
}
