import { InputValues, InputGridValues } from "@UiFolder/functions/InputValues";
import SelectRecord from "@UiFolder/functions/SelectRecord";
import getValues from "@UiFolder/functions/GetValues";

// Create Function
async function AddRemSetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex
) {
  // Click 'New' button
  await sideMenu.btnNew.click();

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Click to add new item
  await page.locator("#btnNewItem").click();

  // Input grid data
  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex);
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Get ui values
  return await getValues(page, paths, gridPaths, cellsIndex);
}

// Edit Function
async function AddRemSetupEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridNewValues,
  cellsIndex
) {
  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Input new data
  if (paths.length == columns.length && columns.length == newValues.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Input new grid data
  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(
      page,
      gridPaths[i],
      gridNewValues[i],
      cellsIndex,
      true
    );
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Search and select created record
  await SelectRecord(page, sideMenu, newValues, "search");

  // Get ui values
  return await getValues(page, paths, gridPaths, cellsIndex);
}

// Delete Function
async function AddRemSetupDelete(page, sideMenu, newValues) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, "search", true);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}

module.exports = {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
};
