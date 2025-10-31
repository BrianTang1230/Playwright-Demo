import { InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { SelectOU } from "@UiFolder/functions/comFuncs";

export async function PreNurseryTransferToCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  await sideMenu.btnCreateNewForm();

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

  await sideMenu.btnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

export async function PreNurseryTransferToEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.btnSave();

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

export async function PreNurseryTransferToDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
