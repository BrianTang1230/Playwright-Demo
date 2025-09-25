import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOU } from "@UiFolder/functions/OpenRecord";

// Create Function
export async function PreNurseryGerminatedCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  // Click "Create New Form" button
  await sideMenu.btnCreateNewForm.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  // Select OU
  await page.locator("#divComboOU .k-dropdown-wrap .k-select").click();
  await page.locator("#ddlOU_listbox li", { hasText: ou[0] }).first().click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  // Input Values
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

// Edit Function
export async function PreNurseryGerminatedEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  // Select the created record
  await FilterRecordByOU(page, values, ou[0], docNo);

  // Input Values
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  // Save edited data
  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function PreNurseryGerminatedDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  // Select the created record
  await FilterRecordByOU(page, values, ou[0], docNo);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
