import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function SalesContractAllocationCreate(
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
    if (i === 7) {
      await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
    } else if (i === 11) {
      await page
        .getByRole("tab", { name: "Payment Terms and Delivery" })
        .click();
    } else if (i === 17) {
      await page.getByRole("tab", { name: "Remarks" }).click();
    }
  }
  await page.getByRole("tab", { name: "General" }).click();

  await sideMenu.clickBtnSave();

  const uiVals = [];

  for (let i = 0; i < paths.length; i++) {
    uiVals.push(await getUiValues(page, [paths[i]]));
    if (i === 7) {
      await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
    } else if (i === 11) {
      await page
        .getByRole("tab", { name: "Payment Terms and Delivery" })
        .click();
    } else if (i === 17) {
      await page.getByRole("tab", { name: "Remarks" }).click();
    }
  }

  return { uiVals };
}

export async function SalesContractAllocationEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou
) {
  await FilterRecordByOUAndDate(page, [values[1]], ou[0], values[0], 2);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
    if (i === 7) {
      await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
    } else if (i === 11) {
      await page
        .getByRole("tab", { name: "Payment Terms and Delivery" })
        .click();
    } else if (i === 17) {
      await page.getByRole("tab", { name: "Remarks" }).click();
    }
  }
  await page.getByRole("tab", { name: "General" }).click();

  await sideMenu.clickBtnSave();

  const uiVals = [];

  for (let i = 0; i < paths.length; i++) {
    uiVals.push(await getUiValues(page, [paths[i]]));
    if (i === 7) {
      await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
    } else if (i === 11) {
      await page
        .getByRole("tab", { name: "Payment Terms and Delivery" })
        .click();
    } else if (i === 17) {
      await page.getByRole("tab", { name: "Remarks" }).click();
    }
  }
  return { uiVals };
}

export async function SalesContractAllocationDelete(
  page,
  sideMenu,
  values,
  ou
) {
  await FilterRecordByOUAndDate(page, [values[1]], ou[0], values[0], 2);

  await sideMenu.clickBtnDelete();
}
