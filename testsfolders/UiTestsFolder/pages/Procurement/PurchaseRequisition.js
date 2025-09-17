import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord } from "@UiFolder/functions/OpenRecord";
import { getUiValues } from "@UiFolder/functions/GetValues";

export async function PurchaseRequisitionCreate(
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
    .locator("ul[aria-hidden='false'] li span", { hasText: ou })
    .first()
    .click();

  if (paths.length !== columns.length && columns.length !== values.length) {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }
  await sideMenu.btnSave.click();

  return getUiValues(page, paths);
}

export async function PurchaseRequisitionEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecord(page, values, ou, docNo, 2);

  if (paths.length == columns.length && columns.length == newValues.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    console.error(paths, columns, newValues);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  await sideMenu.btnSave.click();

  return getUiValues(page, paths);
}

export async function PurchaseRequisitionDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecord(page, values, ou, docNo, 2);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
