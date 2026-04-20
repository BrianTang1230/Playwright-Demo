import { SelectOU } from "@UiFolder/functions/comFuncs";
import {
  InputGridValuesSameCols,
  InputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function MonthlyRatePerOERCreate(
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
    "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
    "#comboBoxOU_listbox li",
    ou[0],
  );

  for (let i = 0; i < paths.length; i++) {
    await InputFormValues(page, paths[i], columns[i], values[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

export async function MonthlyRatePerOEREdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
) {
  await FilterRecordByOUAndDate(page, values, ou[0], values[1], 3, "Dropdown");

  for (let i = 0; i < paths.length; i++) {
    await InputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);

  return { uiVals };
}

export async function MonthlyRatePerOERDelete(page, sideMenu, values, ou) {
  await FilterRecordByOUAndDate(page, values, ou[0], values[1], 3, "Dropdown");

  await sideMenu.clickBtnDelete();
}
