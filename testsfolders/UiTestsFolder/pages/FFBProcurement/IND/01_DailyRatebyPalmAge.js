import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function DailyRatebyPalmAgeCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex,
  ou,
) {
  await sideMenu.clickBtnCreateNewForm();

  await SelectOU(
    page,
    "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
    "#comboBoxOU_listbox li",
    ou[0],
  );

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], values[i]);
  }

  await page.getByRole("button", { name: " New Item" }).click();

  for (let i = 0; i < gridPaths.length; i++) {
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function DailyRatebyPalmAgeEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridValues,
  cellsIndex,
  ou,
) {
  await FilterRecordByOUAndDate(
    page,
    ["Januari 2026"],
    ou[0],
    values[2],
    5,
    "Dropdown",
  );

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function DailyRatebyPalmAgeDelete(page, sideMenu, values, ou) {
  await FilterRecordByOUAndDate(
    page,
    ["Januari 2026"],
    ou[0],
    values[2],
    5,
    "Dropdown",
  );

  await sideMenu.clickBtnDelete();
}
