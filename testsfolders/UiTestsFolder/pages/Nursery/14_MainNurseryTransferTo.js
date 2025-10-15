import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOU } from "@UiFolder/functions/OpenRecord";

export async function MainNurseryTransferToCreate(
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
    "#comboFromOU .k-dropdown-wrap .k-select",
    "#comboBoxInterNurFromOU-list li",
    ou[0]
  );

  await SelectOU(
    page,
    "#comboToOU .k-dropdown-wrap .k-select",
    "#ddlOU_listbox li",
    ou[1]
  );

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

export async function MainNurseryTransferToEdit(
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

export async function MainNurseryTransferToDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecordByOU(page, values, ou[0], docNo);

  await sideMenu.clickBtnDelete();
}
