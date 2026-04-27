import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  getFormValues,
  inputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterRecordByOUAndDate,
} from "@UiFolder/functions/OpenRecord";

export async function PreNurseryTransferToCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou,
) {
  await sideMenu.clickBtnCreateNewForm();

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

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

// Edit Function (Without Saving)
export async function PreNurseryTransferToEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo,
) {
  // Select the created record
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  // Input data
  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.clickBtnClose();

  await sideMenu.rejectBtn.click();

  // Select the created record
  await FilterForUnsaveChecking(page, docNo);

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

export async function PreNurseryTransferToEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

export async function PreNurseryTransferToDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  await sideMenu.clickBtnDelete();
}
