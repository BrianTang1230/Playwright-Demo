import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function WorkerMonthlyTaxDeductionCreate(
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
  await runStep("Create new transaction", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "#divComboOU .k-dropdown .k-select",
      "ul[aria-hidden='false'] li span",
      ou[0]
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add new grid item", async () => {
    await page.locator("#btnNewItem").click();
  });

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#tabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeduct").click();
      }
      await InputGridValuesSameCols(
        page,
        gridPaths[i],
        gridValues[i],
        cellsIndex[i]
      );
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get created UI values", async () => {
    return await getUiValues(page, paths);
  });

  await runStep("Click on tab 1", async () => {
    await page.locator("#tabstripworkDet li").first().click();
  });

  const gridVals1 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2)
    );
  });

  await runStep("Click on tab 2", async () => {
    await page.locator("#tabstripworkDet li").nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3)
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function WorkerMonthlyTaxDeductionEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridValues,
  cellsIndex,
  ou
) {
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], values[2], 5);
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsEmpyGridSelect").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmDelete.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#tabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeduct").click();
      }
      await InputGridValuesSameCols(
        page,
        gridPaths[i],
        gridValues[i],
        cellsIndex[i]
      );
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get created UI values", async () => {
    return await getUiValues(page, paths);
  });

  await runStep("Click on tab 1", async () => {
    await page.locator("#tabstripworkDet li").first().click();
  });

  const gridVals1 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2)
    );
  });

  await runStep("Click on tab 2", async () => {
    await page.locator("#tabstripworkDet li").nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3)
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function WorkerMonthlyTaxDeductionDelete(
  page,
  sideMenu,
  values,
  newValues,
  ou
) {
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], newValues[2], 5);
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
