import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function StockReceiptCreate(
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
    "#divComboOU .k-dropdown-wrap .k-select",
    "#comboBoxOU_listbox li span",
    ou[0]
  );

  for (let i = 0; i < 6; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.locator("#btnPopulatePOItem").click();

  await page.locator("#applyAll").click();

  await page.locator("#btnSaveRecord").click();

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths.slice(0, 6));

  await page.getByRole("gridcell").nth(1).click();

  await page.locator("#btnEditItem").click();

  const gridVals = await getUiValues(page, paths.slice(6, paths.length));

  return { uiVals, gridVals };
}

export async function StockReceiptEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 2);

  for (let i = 0; i < 6; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.locator("#btnNewItem").click();

  for (let i = 6; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await page.locator("#btnSaveRecord").click;

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths.slice(0, 6));

  await page.getByRole("gridcell").nth(1).click();

  await side.btnEditItem.click();

  const gridVals = await getUiValues(page, paths.slice(6, paths.length));

  return { uiVals, gridVals };
}

export async function StockReceiptDelete(page, sideMenu, values, ou, docNo) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 2);

  await sideMenu.clickBtnDelete();
}
