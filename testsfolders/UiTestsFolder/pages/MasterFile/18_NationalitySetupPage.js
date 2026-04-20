import {
  getFormValues,
  InputFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";

// Create Function
export async function NationalitySetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
) {
  // Click "New" button
  await sideMenu.btnNew.click();

  // Input data
  for (let i = 0; i < paths.length; i++) {
    await InputFormValues(page, paths[i], columns[i], values[i]);
  }

  // Save created data
  await sideMenu.clickBtnSave();

  // Search and select created record
  await SelectRecord(page, sideMenu, values);

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

// Edit Function
export async function NationalitySetupEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
) {
  // Search and select the created record
  await SelectRecord(page, sideMenu, values);

  // Input new data
  for (let i = 0; i < paths.length; i++) {
    await InputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  // Save created data
  await sideMenu.clickBtnSave();

  // Search and select created record
  await SelectRecord(page, sideMenu, newValues);

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

// Delete Function
export async function NationalitySetupDelete(page, sideMenu, newValues) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, { del: true });

  // Delete record
  await sideMenu.clickBtnDelete();
}
