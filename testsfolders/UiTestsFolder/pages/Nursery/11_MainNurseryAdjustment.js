import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOU } from "@UiFolder/functions/OpenRecord";

export async function MainNurseryAdjustmentCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.clickBtnCreateNewForm();

  await SelectOU(
    page,
    "#divComboOU .k-dropdown-wrap .k-select",
    "#ddlOU_listbox li",
    ou[0]
  );

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

export async function MainNurseryAdjustmentEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecordByOU(page, values, ou[0], docNo);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

export async function MainNurseryAdjustmentDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecordByOU(page, values, ou[0], docNo);

  await sideMenu.clickBtnDelete();
}
