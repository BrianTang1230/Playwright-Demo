import {
  InputValues,
  InputGridValuesSameCols,
} from "@UiFolder/functions/InputValues";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";
import { getUiValues } from "@UiFolder/functions/GetValues";
// Create Function
export async function AddRemSetupCreate(
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
  if (paths.length !== columns.length && columns.length !== values.length) {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }
  // Click to add new item
  await page.locator("#btnNewItem").click();

  // Input grid data
  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  // Search and select created record
  await SelectRecord(page, sideMenu, values);

  return await getValues(page, paths, gridPaths, cellsIndex);
}

// Edit Function
export async function AddRemSetupEdit(
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
  await SelectRecord(page, sideMenu, values);

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
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridNewValues[i],
      cellsIndex,
      true
    );
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  // Search and select created record
  await SelectRecord(page, sideMenu, newValues);

  return await getValues(page, paths, gridPaths, cellsIndex);
}

// Delete Function
export async function AddRemSetupDelete(page, sideMenu, newValues) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, true);

  // Delete record
  await sideMenu.clickBtnDelete();
}
