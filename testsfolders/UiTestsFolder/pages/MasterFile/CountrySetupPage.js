import { InputValues } from "../../functions/InputValues";
import SelectRecord from "../../functions/SelectRecord";
import getValues from "../../functions/GetValues";

// Create Function
async function CountrySetupCreate(page, sideMenu, paths, columns, values) {
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

  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Get ui values
  return await getValues(page, paths);
}

// Edit Function
async function CountrySetupEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues
) {
  // Search and select the created record
  await SelectRecord(page, sideMenu, values, "search");

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

  // Search and select edited record
  await SelectRecord(page, sideMenu, newValues, "search");

  // Get ui values
  return await getValues(page, paths);
}

// Delete Function
async function CountrySetupDelete(page, sideMenu, newValues) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, "search", null, true);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}

module.exports = { CountrySetupCreate, CountrySetupEdit, CountrySetupDelete };
