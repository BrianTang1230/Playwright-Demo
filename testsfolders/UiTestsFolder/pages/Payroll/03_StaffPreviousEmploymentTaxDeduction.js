import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionBy3Criterias,
} from "@UiFolder/functions/OpenRecord";

export async function StaffPreviousEmploymentTaxDeductionCreate(
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
        await page.locator("#prTabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeductionItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    await page.locator("#prTabstripworkDet li").first().click();
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    const gridVals1 = await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2),
    );

    await page.locator("#prTabstripworkDet li").nth(1).click();
    const gridVals2 = await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
    );

    return [...gridVals1, ...gridVals2];
  });

  return { uiVals, gridVals };
}

export async function StaffPreviousEmploymentTaxDeductionEdit1(
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
    await FilterTransactionBy3Criterias(
      page,
      values[0],
      ou[0],
      keyword,
      "Employee",
      "Dropdown",
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Remove grid item", async () => {
    await page.locator("#IsPRPreEmpySelect").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
  });

  await runStep("Add new grid item", async () => {
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#prTabstripworkDet li").nth(1).click();
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
    await FilterForUnsaveChecking(page, keyword);
  });

  await page.locator("#prTabstripworkDet li").first().click();

  const uiVals = await runStep("Get UI values", async () => {
    await page.locator("#prTabstripworkDet li").first().click();
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    const gridVals1 = await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2),
    );

    await page.locator("#prTabstripworkDet li").nth(1).click();
    const gridVals2 = await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
    );

    return [...gridVals1, ...gridVals2];
  });

  return { uiVals, gridVals };
}

export async function StaffPreviousEmploymentTaxDeductionEdit2(
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
    await FilterTransactionBy3Criterias(
      page,
      values[0],
      ou[0],
      keyword,
      "Employee",
      "Dropdown",
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Remove grid item", async () => {
    await page.locator("#IsPRPreEmpySelect").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
  });

  await runStep("Add new grid item", async () => {
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewBIK").click();
      if (i === 2) {
        await page.locator("#prTabstripworkDet li").nth(1).click();
        await page.locator("#btnNewDeductionItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    await page.locator("#prTabstripworkDet li").first().click();
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    const gridVals1 = await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2),
    );

    await page.locator("#prTabstripworkDet li").nth(1).click();
    const gridVals2 = await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
    );

    return [...gridVals1, ...gridVals2];
  });

  return { uiVals, gridVals };
}

export async function StaffPreviousEmploymentTaxDeductionDelete(
  page,
  sideMenu,
  values,
  ou,
  keyword,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy3Criterias(
      page,
      values[0],
      ou[0],
      keyword,
      "Employee",
      "Dropdown",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
