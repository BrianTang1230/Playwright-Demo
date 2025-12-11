import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function NurseryTransferRequisitionCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await runStep("Create new transaction", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "#divComboOU .k-dropdown-wrap .k-select",
      "#ddlOU_listbox li",
      ou[0]
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get created UI values", async () => {
    return await getUiValues(page, paths);
  });

  return { uiVals };
}

export async function NurseryTransferRequisitionEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], docNo, 3);
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getUiValues(page, paths);
  });

  return { uiVals };
}

export async function NurseryTransferRequisitionDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], docNo, 3);
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
