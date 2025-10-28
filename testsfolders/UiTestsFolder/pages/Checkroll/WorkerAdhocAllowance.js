import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function WorkerAdhocAllowanceCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex,
  ou
) {
  await sideMenu.clickBtnCreateNewForm();

  await SelectOU(
    page,
    "#divComboOU .k-dropdown-wrap .k-select",
    "#comboBoxOU_listbox span",
    ou[0]
  );

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnAddNewItem.click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function WorkerAdhocAllowanceEdit(
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
  docNo
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await page.locator("#IsAdHocAllowEmpySelectGrid").check();
  await page.locator("#btnDeleteItem").click();
  await sideMenu.confirmDelete.click();
  await sideMenu.btnAddNewItem.click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function WorkerAdhocAllowanceDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);

  await sideMenu.clickBtnDelete();
}
