import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterForUnsaveChecking, FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function DailyTotalCropReceiptByCropSupplierCreate(
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
    "div.viewModeOU.pinOU .k-dropdown .k-select",
    "#comboBoxOU_listbox li",
    ou[0],
  );

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnAddNewItem.click();

  for (let i = 0; i < gridPaths.length; i++) {
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function DailyTotalCropReceiptByCropSupplierEdit1(
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
  await FilterRecordByOUAndDate(page, values, ou[0], values[0], 2, "Directly");

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnClose();

  await sideMenu.rejectBtn.click();

  // Select the created record
  await FilterForUnsaveChecking(page, values[0]);

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function DailyTotalCropReceiptByCropSupplierEdit2(
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
  await FilterRecordByOUAndDate(page, values, ou[0], values[0], 2, "Directly");

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

export async function DailyTotalCropReceiptByCropSupplierDelete(
  page,
  sideMenu,
  values,
  ou,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], values[0], 2, "Directly");

  await sideMenu.clickBtnDelete();
}
