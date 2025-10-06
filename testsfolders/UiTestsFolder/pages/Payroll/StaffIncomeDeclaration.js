import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOU } from "@UiFolder/functions/OpenRecord";

export async function StaffIncomeDeclarationCreate(
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
    "#divComboOU .k-dropdown .k-select",
    "ul[aria-hidden='false'] li span",
    ou[0]
  );

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    i === 0
      ? await sideMenu.btnAddNewItem.click()
      : await page.locator("#btnNewIncome").click();
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function StaffIncomeDeclarationEdit(
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
  keyword
) {
  await FilterRecordByOU(page, values, ou[0], keyword, 3, "OT");

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await page.locator("#IsTaxDeductArrEmpySelectGrid").check();
  await page.locator("#btnDeleteItem").click();
  await sideMenu.confirmDelete.click();
  await sideMenu.btnAddNewItem.click();

  for (let i = 0; i < gridPaths.length; i++) {
    if (i === 1) {
      await page.locator("#btnNewIncome").click();
    }
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function StaffIncomeDeclarationDelete(
  page,
  sideMenu,
  values,
  ou,
  keyword
) {
  await FilterRecordByOU(page, values, ou[0], keyword, 3, "OT");

  await sideMenu.clickBtnDelete();
}
