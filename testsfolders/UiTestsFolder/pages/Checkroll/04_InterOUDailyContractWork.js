import { region } from "@utils/commonFunctions/GlobalSetup";
import { runStep, SelectOU } from "@UiFolder/functions/comFuncs";
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

export async function InterOUDailyContractWorkCreate(
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
  const tabLocator =
    region === "IND" ? "#tabstripworkDet li" : "#interouTabstripworkDet li";

  await runStep("Open create new form", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "#divComboOU .k-dropdown-wrap .k-select >> nth=0",
      "#ddlFromOU_listbox li span",
      ou[0],
    );

    await SelectOU(
      page,
      "#divComboOU .k-dropdown-wrap .k-select >> nth=1",
      "#ddlToOU_listbox li span",
      ou[1],
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add new grid item", async () => {
    await page.locator("#btnNewItem").click();
  });

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewDWItem").click();
      if (i === 2) {
        await page.locator(tabLocator).nth(1).click();
        await page.locator("#btnNewPRWItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(
      page,
      region === "IND" ? paths.slice(0, 4) : paths,
    );
  });

  await runStep("Click on tab 1", async () => {
    await page.locator(tabLocator).first().click();
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
    await page.locator(tabLocator).nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
      { isOneRow: true },
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function InterOUDailyContractWorkEdit1(
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
  const tabLocator =
    region === "IND" ? "#tabstripworkDet li" : "#interouTabstripworkDet li";

  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      docNo,
      "ICW No.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelectGrid").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) {
        await page.locator(tabLocator).first().click();
        await page.locator("#btnNewDWItem").click();
      }
      if (i === 2) {
        await page.locator(tabLocator).nth(1).click();
        await page.locator("#btnNewPRWItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, docNo);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(
      page,
      region === "IND" ? paths.slice(0, 4) : paths,
    );
  });

  await runStep("Click on tab 1", async () => {
    await page.locator(tabLocator).first().click();
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
    await page.locator(tabLocator).nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
      { isOneRow: true },
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function InterOUDailyContractWorkEdit2(
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
  const tabLocator =
    region === "IND" ? "#tabstripworkDet li" : "#interouTabstripworkDet li";

  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      docNo,
      "ICW No.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelectGrid").check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) {
        await page.locator(tabLocator).first().click();
        await page.locator("#btnNewDWItem").click();
      }
      if (i === 2) {
        await page.locator(tabLocator).nth(1).click();
        await page.locator("#btnNewPRWItem").click();
      }
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(
      page,
      region === "IND" ? paths.slice(0, 4) : paths,
    );
  });

  await runStep("Click on tab 1", async () => {
    await page.locator(tabLocator).first().click();
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
    await page.locator(tabLocator).nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3),
      { isOneRow: true },
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function InterOUDailyContractWorkDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      docNo,
      "ICW No.",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
