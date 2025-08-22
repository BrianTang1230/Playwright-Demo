import { InputValues } from "@UiFolder/functions/InputValues";
import SelectRecord from "@UiFolder/functions/SelectRecord";
import getValues from "@UiFolder/functions/GetValues";

// Create Function
async function PreNurserySeedReceivedCreate(
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

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    console.log(paths.length, columns.length, values.length);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Saved created data
  await sideMenu.btnSave.click();

  // Get ui values
  return await getValues(page, paths);
}

// Edit Function
async function PreNurserySeedReceivedEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou
) {
  // Select the created record
  await SelectRecord(page, sideMenu, values, "filter", ou);

  // Select OU
  await page.locator("#ddlOU").selectOption({ label: `${ou}` });

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Saved created data
  await sideMenu.btnSave.click();

  // Get ui values
  return await getValues(page, paths);
}

module.exports = {
  PreNurserySeedReceivedCreate,
  PreNurserySeedReceivedEdit,
};
