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

export async function MonthlyRatePerOERCreate(
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
      "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
      "#comboBoxOU_listbox li",
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

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

export async function MonthlyRatePerOEREdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      values[1],
      "Region",
      "Dropdown",
    );
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
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

  return { uiVals };
}

export async function MonthlyRatePerOEREdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      values[1],
      "Region",
      "Dropdown",
    );
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

export async function MonthlyRatePerOERDelete(page, sideMenu, values, ou) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[0],
      ou[0],
      values[1],
      "Region",
      "Dropdown",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
