import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";

// Create Function
export async function DivisionSetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou,
) {
  await runStep("Open create new form", async () => {
    await sideMenu.btnNew.click();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "div.masterModeOU .k-dropdown .k-select",
      "#comboBoxOU_listbox li span",
      ou[0],
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
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

  return { uiVals };
}

export async function DivisionSetupEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
) {
  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "div.masterModeOU .k-dropdown .k-select",
      "#comboBoxOU_listbox li span",
      ou[0],
    );
  });

  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
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

  return { uiVals };
}

// Edit Function
export async function DivisionSetupEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
) {
  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "div.masterModeOU .k-dropdown .k-select",
      "#comboBoxOU_listbox li span",
      ou[0],
    );
  });

  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
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

  return { uiVals };
}

// Delete Function
export async function DivisionSetupDelete(page, sideMenu, newValues, ou) {
  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "div.masterModeOU .k-dropdown .k-select",
      "#comboBoxOU_listbox li span",
      ou[0],
    );
  });

  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, newValues, "delete");
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
