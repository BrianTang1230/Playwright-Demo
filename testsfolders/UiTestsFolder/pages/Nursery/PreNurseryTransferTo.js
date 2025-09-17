import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord } from "@UiFolder/functions/OpenRecord";
import { getUiValues } from "@UiFolder/functions/GetValues";

export async function PreNurseryTransferToCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.btnCreateNewForm.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#comboFromOU .k-dropdown-wrap .k-select").click();
  await page
    .locator("#comboBoxInterNurFromOU-list li", { hasText: ou[0] })
    .first()
    .click();

  await page.locator("#comboToOU .k-dropdown-wrap .k-select").click();
  await page.locator("#ddlOU_listbox li", { hasText: ou[1] }).first().click();

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function PreNurseryTransferToEdit(
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

export async function PreNurseryTransferToDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecord(page, values, ou[0], docNo);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
