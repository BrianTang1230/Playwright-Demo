import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

// Create Function
export async function PreNurseryDoubletonSplittingCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  // Click "Create New Form" button
  await sideMenu.btnCreateNewForm();

  // Select OU
  await SelectOU(
    page,
    "#divComboOU .k-dropdown-wrap .k-select",
    "#ddlOU_listbox li",
    ou[0]
  );

  // Input data
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.btnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

// Edit Function
export async function PreNurseryDoubletonSplittingEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  // Select the created record
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  // Input data
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.btnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

export async function PreNurseryDoubletonSplittingDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  // Select the created record
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
