import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function WorkerAdditionalRemunerationCreate(
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

  await runStep("Add and create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      i === 0
        ? await page.locator("#btnNewEmpRem").click()
        : await page.locator("#btnAddNewItemRem").click();
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get created grid UI values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  return { uiVals, gridVals };
}

export async function WorkerAdditionalRemunerationEdit(
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
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], docNo, 2);
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) {
        await sideMenu.confirmBtn.click();
        await page.locator("#btnAddNewItemRem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get edited grid UI values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  return { uiVals, gridVals };
}

export async function WorkerAdditionalRemunerationDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], docNo, 2);
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
