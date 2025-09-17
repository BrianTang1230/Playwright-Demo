import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord } from "@UiFolder/functions/OpenRecord";

export async function MainNurseryReceivedCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.btnCreateNewForm.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#divComboOU .k-dropdown-wrap .k-select").click();
  await page.locator("#ddlOU_listbox li", { hasText: ou }).first().click();

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function MainNurseryReceivedEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecord(page, values, ou[0], docNo);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function MainNurseryReceivedDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  // Select the created record
  await FilterRecord(page, values, ou[0], docNo);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
