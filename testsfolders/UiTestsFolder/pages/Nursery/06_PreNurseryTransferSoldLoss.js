import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  getFormValues,
  inputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterRecordByOUAndDate,
  FilterForUnsaveChecking,
} from "@UiFolder/functions/OpenRecord";

export async function PreNurseryTransferSoldLossCreate(
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
    "#divComboOU .k-dropdown-wrap .k-select",
    "#ddlOU_listbox li",
    ou[0],
  );

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

// Edit Function (Without Saving)
export async function PreNurseryTransferSoldLossEdit1(
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

  // Input Values
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

export async function PreNurseryTransferSoldLossEdit2(
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

export async function PreNurseryTransferSoldLossDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  await sideMenu.clickBtnDelete();
}
