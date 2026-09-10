import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";
import {
  inputFormValues,
  getFormValues,
  inputGridValues,
  getGridValues,
  inputTreeViewValues,
  getTreeViewUiValues,
} from "@UiFolder/functions/valuesFuncs";

// Create Function
export async function HolidayProfileSetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex,
  treeViewPath,
  treeViewCreateValues,
) {
  await runStep("Open create new form", async () => {
    await sideMenu.btnNew.click();
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add grid item", async () => {
    await page.locator("#btnNewItem").click();
  });

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Input tree View values", async () => {
    await inputTreeViewValues(page, treeViewPath, treeViewCreateValues);
  });


  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  await runStep("Reopen transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  const treeViewUiVals = await runStep("Get TreeView UI values", async () => {
    return await getTreeViewUiValues(page, treeViewPath);
  });

  return { uiVals, gridVals, treeViewUiVals };
}

// Edit Function
export async function HolidayProfileSetupEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridNewValues,
  cellsIndex,
  treeViewPath,
  treeViewEditValues,
) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(
        page,
        gridPaths[i],
        gridNewValues[i],
        cellsIndex[i],
      );
    }
  });

  await runStep("Edit tree View values", async () => {
    await inputTreeViewValues(page, treeViewPath, treeViewEditValues);
  });

  await runStep("Close edited transaction without save", async () => {
    await page.getByRole("button", { name: "Cancel" }).click();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await SelectRecord(page, sideMenu, values, "reopen");
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  const treeViewUiVals = await runStep("Get TreeView UI values", async () => {
    return await getTreeViewUiValues(page, treeViewPath);
  });

  return { uiVals, gridVals, treeViewUiVals };
}

export async function HolidayProfileSetupEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridNewValues,
  cellsIndex,
  treeViewPath,
  treeViewEditValues,
) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(
        page,
        gridPaths[i],
        gridNewValues[i],
        cellsIndex[i],
      );
    }
  });

  await runStep("Edit tree View values", async () => {
    await inputTreeViewValues(page, treeViewPath, treeViewEditValues);
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  await runStep("Reopen transaction", async () => {
    await SelectRecord(page, sideMenu, newValues);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex, { isOneRow: true });
  });

  const treeViewUiVals = await runStep("Get TreeView UI values", async () => {
    return await getTreeViewUiValues(page, treeViewPath);
  });

  return { uiVals, gridVals, treeViewUiVals };
}

// Delete Function
export async function HolidayProfileSetupDelete(page, sideMenu, newValues) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, newValues, "delete");
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
