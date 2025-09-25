import { InputValues } from "@UiFolder/functions/InputValues";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";
import getValues from "@UiFolder/functions/GetValues";

// Create Function
export async function CountrySetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values
) {
  // Click "New" button
  await sideMenu.btnNew.click();

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  // Search and select created record
  await SelectRecord(page, sideMenu, values);

  return await getValues(page, paths);
}

// Edit Function
export async function CountrySetupEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues
) {
  // Search and select the created record
  await SelectRecord(page, sideMenu, values);

  // Input new data
  if (paths.length == columns.length && columns.length == newValues.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Save edited data
  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  // Search and select edited record
  await SelectRecord(page, sideMenu, newValues);

  return await getValues(page, paths);
}

// Delete Function
export async function CountrySetupDelete(page, sideMenu, newValues) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, true);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
