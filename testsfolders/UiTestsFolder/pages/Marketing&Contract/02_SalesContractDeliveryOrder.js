import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function SalesContractDeliveryOrderCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.clickBtnCreateNewForm();

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
    if (i === 8) {
      await page.getByRole("tab", { name: "Delivery", exact: true }).click();
    }
  }

  await page.getByRole("tab", { name: "General" }).click();

  await sideMenu.clickBtnSave();

  const uiVals = [];

  for (let i = 0; i < paths.length; i++) {
    uiVals.push(await getUiValues(page, [paths[i]]));
    if (i === 8) {
      await page.getByRole("tab", { name: "Delivery", exact: true }).click();
    }
  }

  return { uiVals };
}

export async function SalesContractDeliveryOrderEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou
) {
  await FilterRecordByOUAndDate(page, [values[2]], ou[0], values[0], 1);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
    if (i === 11) {
      await page.getByRole("tab", { name: "Delivery", exact: true }).click();
    }
  }

  await page.getByRole("tab", { name: "General" }).click();

  await sideMenu.clickBtnSave();

  const uiVals = [];

  for (let i = 0; i < paths.length; i++) {
    uiVals.push(await getUiValues(page, [paths[i]]));
    if (i === 11) {
      await page.getByRole("tab", { name: "Delivery", exact: true }).click();
    }
  }

  return { uiVals };
}

export async function SalesContractDeliveryOrderDelete(
  page,
  sideMenu,
  values,
  ou
) {
  await FilterRecordByOUAndDate(page, [values[2]], ou[0], values[0], 1);

  await sideMenu.clickBtnDelete();
}
