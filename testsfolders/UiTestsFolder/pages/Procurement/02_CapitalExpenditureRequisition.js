import { runStep, SelectOU } from "@UiFolder/functions/comFuncs";
import {
  getFormValues,
  inputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionByFixedUQF,
} from "@UiFolder/functions/OpenRecord";

export async function CapitalExpenditureRequisitionCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
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
    for (let i = 3; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Save grid item", async () => {
    await sideMenu.btnSaveRecord.click();
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths.slice(0, 3));
  });
  const gridVals = await runStep("Get created Grid values", async () => {
    await page.locator("#btnEditItem").click();
    return await getFormValues(page, paths.slice(3, paths.length));
  });

  return { uiVals, gridVals };
}

export async function CapitalExpenditureRequisitionEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionByFixedUQF(
      page,
      ["OUCode_input", "FromDate", "ToDate", "prnum"],
      [ou[0], values[0], values[1], docNo],
      1,
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    await sideMenu.btnEditItem.click();
    for (let i = 3; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Save grid item", async () => {
    await sideMenu.btnSaveRecord.click();
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, docNo);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths.slice(0, 3));
  });
  const gridVals = await runStep("Get edited Grid values", async () => {
    await page.locator("#btnEditItem").click();
    return await getFormValues(page, paths.slice(3, paths.length));
  });

  return { uiVals, gridVals };
}

export async function CapitalExpenditureRequisitionEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionByFixedUQF(
      page,
      ["OUCode_input", "FromDate", "ToDate", "prnum"],
      [ou[0], values[0], values[1], docNo],
      1,
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.slice(0, 3).length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    await sideMenu.btnEditItem.click();
    for (let i = 3; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Save grid item", async () => {
    await sideMenu.btnSaveRecord.click();
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths.slice(0, 3));
  });
  const gridVals = await runStep("Get edited Grid values", async () => {
    await page.locator("#btnEditItem").click();
    return await getFormValues(page, paths.slice(3, paths.length));
  });

  return { uiVals, gridVals };
}

export async function CapitalExpenditureRequisitionDelete(
  page,
  sideMenu,
  newValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionByFixedUQF(
      page,
      ["OUCode_input", "FromDate", "ToDate", "prnum"],
      [ou[0], newValues[0], newValues[1], docNo],
      1,
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
