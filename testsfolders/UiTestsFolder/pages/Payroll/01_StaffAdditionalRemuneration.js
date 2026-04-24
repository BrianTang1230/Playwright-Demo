import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function StaffAdditionalRemunerationCreate(
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
    "#divComboOU .k-dropdown .k-select",
    "ul[aria-hidden='false'] li span",
    ou[0],
  );

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await inputFormValues(page, paths[i], columns[i], values[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    i === 0
      ? await page.locator("#btnNewEmpRem").click()
      : await page.locator("#btnAddNewItemRem").click();
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function StaffAdditionalRemunerationEdit(
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
  docNo,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 2);

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    if (i === 1) {
      await sideMenu.confirmBtn.click();
      await page.locator("#btnAddNewItemRem").click();
    }
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function StaffAdditionalRemunerationDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 2);

  await sideMenu.clickBtnDelete();
}
