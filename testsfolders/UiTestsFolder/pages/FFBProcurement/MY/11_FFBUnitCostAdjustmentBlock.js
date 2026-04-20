import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  InputGridValuesSameCols,
  InputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterRecordByOU,
  FilterRecordByOUAndDate,
} from "@UiFolder/functions/OpenRecord";

export async function FFBUnitCostAdjustmentBlockCreate(
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
    await InputFormValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnAddNewItem.click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i],
    );
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function FFBUnitCostAdjustmentBlockEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridValues,
  gridNewValues,
  cellsIndex,
  ou,
) {
  await FilterRecordByOUAndDate(
    page,
    values,
    ou[0],
    gridValues[0].split(";")[0],
    2,
    "Directly",
  );

  for (let i = 0; i < paths.length; i++) {
    await InputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridNewValues[i],
      cellsIndex[i],
    );
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function FFBUnitCostAdjustmentBlockDelete(
  page,
  sideMenu,
  values,
  gridValues,
  ou,
) {
  await FilterRecordByOUAndDate(
    page,
    values,
    ou[0],
    gridValues[0].split(";")[0],
    2,
    "Directly",
  );

  await sideMenu.clickBtnDelete();
}
