import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";
import {
  inputFormValues,
  getFormValues,
  inputTreeViewValues,
  getTreeViewUiValues,
} from "@UiFolder/functions/valuesFuncs";

// Create Function
export async function BeneficiaryInformationSetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
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

  const treeViewUiVals = await runStep("Get TreeView UI values", async () => {
    return await getTreeViewUiValues(page, treeViewPath);
  });

  return { uiVals, treeViewUiVals };
}

// Edit Function
export async function BeneficiaryInformationSetupEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
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

  const treeViewUiVals = await runStep("Get TreeView UI values", async () => {
    return await getTreeViewUiValues(page, treeViewPath);
  });

  return { uiVals, treeViewUiVals };
}

export async function BeneficiaryInformationSetupEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
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

  const treeViewUiVals = await runStep("Get TreeView UI values", async () => {
    return await getTreeViewUiValues(page, treeViewPath);
  });

  return { uiVals, treeViewUiVals };
}

// Delete Function
export async function BeneficiaryInformationSetupDelete(page, sideMenu, newValues) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, newValues, "delete");
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
