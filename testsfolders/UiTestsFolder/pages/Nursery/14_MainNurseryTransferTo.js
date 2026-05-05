import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
  getFormValues,
  inputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionBy3Criterias,
} from "@UiFolder/functions/OpenRecord";

export async function MainNurseryTransferToCreate(
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

  await runStep("Select From OU and To OU", async () => {
    await SelectOU(
      page,
      "#comboFromOU .k-dropdown-wrap .k-select",
      "#comboBoxInterNurFromOU-list li",
      ou[0],
    );

    await SelectOU(
      page,
      "#comboToOU .k-dropdown-wrap .k-select",
      "#ddlOU_listbox li",
      ou[1],
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

  const uiVals = await runStep("Get created UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

// Edit Function (Without Saving)
export async function MainNurseryTransferToEdit1(
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
    await FilterTransactionBy3Criterias(
      page,
      values[0],
      ou[0],
      docNo,
      "NT No.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, docNo);
  });

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

export async function MainNurseryTransferToEdit2(
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
    await FilterTransactionBy3Criterias(
      page,
      values[0],
      ou[0],
      docNo,
      "NT No.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

export async function MainNurseryTransferToDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy3Criterias(
      page,
      values[0],
      ou[0],
      docNo,
      "NT No.",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
