import { runStep, SelectOU } from "@UiFolder/functions/comFuncs";
import {
  getFormValues,
  inputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionByFixedUQF,
} from "@UiFolder/functions/OpenRecord";

export async function RequestforQuotationCreate(
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
  await runStep("Open create new form", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "#divComboOU .k-dropdown .k-select",
      "ul[aria-hidden='false'] li span",
      ou[0],
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add new grid item", async () => {
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Input grid values", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return getFormValues(page, paths);
  });
  const gridVals = await runStep("Get created Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex);
  });

  return { uiVals, gridVals };
}

export async function RequestforQuotationEdit(
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
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
    if (i === paths.length - 2) await sideMenu.confirmBtn.click();
  }

  await page.locator("#btnPopulate").click();

  for (let i = 0; i < gridPaths.length; i++) {
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function RequestforQuotationDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);

  await sideMenu.clickBtnDelete();
}
