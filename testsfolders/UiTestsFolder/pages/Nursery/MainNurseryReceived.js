import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord, SelectRecord } from "@UiFolder/functions/OpenRecord";
import getValues from "@UiFolder/functions/GetValues";

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

  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  return await getValues(page, paths);
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
  await FilterRecord(page, values, ou, docNo);

  if (paths.length == columns.length && columns.length == newValues.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  return await getValues(page, paths);
}

export async function MainNurseryReceivedDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  // Select the created record
  await FilterRecord(page, values, ou, docNo);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
