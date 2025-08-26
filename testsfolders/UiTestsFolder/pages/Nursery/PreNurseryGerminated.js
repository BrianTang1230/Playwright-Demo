import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord, SelectRecord } from "@UiFolder/functions/OpenRecord";
import getValues from "@UiFolder/functions/GetValues";

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

  // Select OU
  await page.locator("#divComboOU .k-dropdown-wrap .k-select").click();
  await page.locator("#ddlOU_listbox li", { hasText: ou }).first().click();

  // Input Values
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Saved created data
  await sideMenu.btnSave.click();

  // Get ui values
  return await getValues(page, paths);
}

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
  await FilterRecord(page, values, ou, docNo);

  // Input Values
  if (paths.length == columns.length && columns.length == newValues.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Save edited data
  await sideMenu.btnSave.click();

  // Get ui values
  return await getValues(page, paths);
}

export async function PreNurseryGerminatedDelete(
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
