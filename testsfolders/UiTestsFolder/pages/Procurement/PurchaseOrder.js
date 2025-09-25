import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByDateRange } from "@UiFolder/functions/OpenRecord";

export async function PurchaseOrderCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.btnCreateNewForm.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#divComboOU .k-dropdown .k-select").first().click();
  await page
    .locator("ul[aria-hidden='false'] li span", { hasText: ou[0] })
    .first()
    .click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  for (let i = 0; i < paths.slice(0, 9).length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.locator("#btnNewItem").click();

  for (let i = 9; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSaveRecord.click();

  // await sideMenu.btnSave.click();

  // await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function PurchaseOrderEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await sideMenu.btnCreateNewForm.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#divComboOU .k-dropdown .k-select").first().click();
  await page
    .locator("ul[aria-hidden='false'] li span", { hasText: ou[0] })
    .first()
    .click();

  for (let i = 0; i < paths.slice(0, 9).length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.locator("#btnNewItem").click();

  for (let i = 9; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSaveRecord.click();

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}
