import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputValues,
  InputGridValuesSameCols,
} from "@UiFolder/functions/InputValues";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";

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
  await sideMenu.clickBtnSave();

  // Search and select created record
  await SelectRecord(page, sideMenu, values);

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
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
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  // Input new grid data
  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridNewValues[i],
      cellsIndex[i]
    );
  }

  // Save created data
  await sideMenu.clickBtnSave();

  // Search and select created record
  await SelectRecord(page, sideMenu, newValues);

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

// Delete Function
export async function AddRemSetupDelete(page, sideMenu, newValues) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, { del: true });

  // Delete record
  await sideMenu.clickBtnDelete();
}
