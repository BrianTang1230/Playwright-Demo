import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByDateRange } from "@UiFolder/functions/OpenRecord";

export async function PurchaseRequisitionCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.clickBtnCreateNewForm();

  await SelectOU(
    page,
    "#divComboOU .k-dropdown .k-select",
    "ul[aria-hidden='false'] li span",
    ou[0]
  );

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnAddNewItem.click();

  for (let i = 3; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSaveRecord.click();

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths.slice(0, 3));
  await page.locator("#btnEditItem").click();
  const gridVals = await getUiValues(page, paths.slice(3, paths.length));

  return { uiVals, gridVals };
}

export async function PurchaseRequisitionEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecordByDateRange(page, values, ou[0], docNo);

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.btnEditItem.click();

  for (let i = 3; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.btnSaveRecord.click();

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths.slice(0, 3));
  await page.locator("#btnEditItem").click();
  const gridVals = await getUiValues(page, paths.slice(3, paths.length));

  return { uiVals, gridVals };
}

export async function PurchaseRequisitionDelete(
  page,
  sideMenu,
  newValues,
  ou,
  docNo
) {
  await FilterRecordByDateRange(page, newValues, ou[0], docNo);

  await sideMenu.clickBtnDelete();
}
