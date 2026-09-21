import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionBy2And1Criterias,
} from "@UiFolder/functions/OpenRecord";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";

export async function PressCakeNutCompositionCreate(
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
      "div.viewModeOU.pinOU .k-dropdown .k-select",
      "#ddlOU_listbox li",
      ou[0],
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add new grid item", async () => {
    await page.locator("#btnNewItemDura").click();
  });

  await runStep("Input grid values", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 2) await page.locator("#btnNewItemKernel").click();
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });
  const gridVals = await runStep("Get created Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  return { uiVals, gridVals };
}

export async function PressCakeNutCompositionEdit1(
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
  keyword,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      keyword.split(" - ")[0],
      "Test Component Code",
      "Dropdown",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, keyword);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });
  const gridVals = await runStep("Get created Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  return { uiVals, gridVals };
}

export async function PressCakeNutCompositionEdit2(
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
  keyword,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      keyword.split(" - ")[0],
      "Test Component Code",
      "Dropdown",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });
  const gridVals = await runStep("Get edited Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  return { uiVals, gridVals };
}

export async function PressCakeNutCompositionDelete(
  page,
  sideMenu,
  values,
  ou,
  keyword,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      keyword.split(" - ")[0],
      "Test Component Code",
      "Dropdown",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
