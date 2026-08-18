import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { region } from "@utils/commonFunctions/GlobalSetup";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionBy2And1Criterias,
} from "@UiFolder/functions/OpenRecord";

export async function WorkerPreviousEmploymentTaxDeductionCreate(
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

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#crTabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeductionItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  await runStep("Click on tab 1", async () => {
    await page.locator("#crTabstripworkDet li").first().click();
  });

  const gridVals1 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2),
      { isOneRow: true },
    );
  });

  await runStep("Click on tab 2", async () => {
    await page.locator("#crTabstripworkDet li").nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function WorkerPreviousEmploymentTaxDeductionEdit1(
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
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      values[1],
      "Gang",
      "Dropdown",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelect").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#crTabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeductionItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, values[1]);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  await runStep("Click on tab 1", async () => {
    await page.locator("#crTabstripworkDet li").first().click();
  });

  const gridVals1 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2),
      { isOneRow: true },
    );
  });

  await runStep("Click on tab 2", async () => {
    await page.locator("#crTabstripworkDet li").nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function WorkerPreviousEmploymentTaxDeductionEdit2(
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
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      values[1],
      "Gang",
      "Dropdown",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelect").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#crTabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeductionItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  await runStep("Click on tab 1", async () => {
    await page.locator("#crTabstripworkDet li").first().click();
  });

  const gridVals1 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2),
      { isOneRow: true },
    );
  });

  await runStep("Click on tab 2", async () => {
    await page.locator("#crTabstripworkDet li").nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function WorkerPreviousEmploymentTaxDeductionDelete(
  page,
  sideMenu,
  values,
  ou,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      values[1],
      "Gang",
      "Dropdown",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
