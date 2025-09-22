import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import {
  FilterRecordByDateRange,
  FilterRecordByOU,
} from "@UiFolder/functions/OpenRecord";

export async function RequestforQuotationCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex,
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

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.locator("#btnNewItem").click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function RequestforQuotationEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridValues,
  cellsIndex,
  ou,
  docNo
) {
  await FilterRecordByOU(page, values, ou[0], docNo, 4);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
    if (i === paths.length - 2) await sideMenu.confirmDelete.click();
  }

  await page.locator("#btnPopulate").click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function RequestforQuotationDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecordByOU(page, values, ou[0], docNo, 4);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
