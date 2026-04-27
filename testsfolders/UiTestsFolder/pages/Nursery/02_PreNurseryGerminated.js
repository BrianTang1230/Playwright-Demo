import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  getFormValues,
  inputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterRecordByOUAndDate,
} from "@UiFolder/functions/OpenRecord";

// Create Function
export async function PreNurseryGerminatedCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou,
) {
  // Click "Create New Form" button
  await sideMenu.clickBtnCreateNewForm();

  // Select OU
  await SelectOU(
    page,
    "#divComboOU .k-dropdown-wrap .k-select",
    "#ddlOU_listbox li",
    ou[0],
  );

  // Input Values
  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

// Edit Function (Without Saving)
export async function PreNurseryGerminatedEdit1(
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

// Edit Function (With Saving)
export async function PreNurseryGerminatedEdit2(
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

  // Save edited data
  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

export async function PreNurseryGerminatedDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  // Select the created record
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  // Delete record
  await sideMenu.clickBtnDelete();
}
