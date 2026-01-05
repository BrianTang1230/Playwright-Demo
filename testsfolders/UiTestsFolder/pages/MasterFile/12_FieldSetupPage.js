import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getUiValues } from "@UiFolder/functions/GetValues";
import { InputValues } from "@UiFolder/functions/InputValues";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";

// Create Function
export async function FieldSetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou
) {
  // Click "New" button
  await sideMenu.btnNew.click();

  await SelectOU(
    page,
    "div.masterModeOU .k-dropdown .k-select",
    "#comboBoxOU_listbox li span",
    ou[0]
  );

  // Input data
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  // Save created data
  await sideMenu.clickBtnSave();

  // Search and select created record
  await SelectRecord(page, sideMenu, values, {
    hasOU: true,
    selectOU: () =>
      SelectOU(
        page,
        "div.masterModeOU .k-dropdown .k-select",
        "#comboBoxOU_listbox li span",
        ou[0]
      ),
  });

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

// Edit Function
export async function FieldSetupEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou
) {
  // Search and select the created record
  await SelectRecord(page, sideMenu, values, {
    hasOU: true,
    selectOU: () =>
      SelectOU(
        page,
        "div.masterModeOU .k-dropdown .k-select",
        "#comboBoxOU_listbox li span",
        ou[0]
      ),
  });

  // Input new data
  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  // Save created data
  await sideMenu.clickBtnSave();

  // Search and select created record
  await SelectRecord(page, sideMenu, newValues, {
    hasOU: true,
    selectOU: () =>
      SelectOU(
        page,
        "div.masterModeOU .k-dropdown .k-select",
        "#comboBoxOU_listbox li span",
        ou[0]
      ),
  });

  const uiVals = await getUiValues(page, paths);

  return { uiVals };
}

// Delete Function
export async function FieldSetupDelete(page, sideMenu, newValues, ou) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, newValues, {
    del: true,
    hasOU: true,
    selectOU: () =>
      SelectOU(
        page,
        "div.masterModeOU .k-dropdown .k-select",
        "#comboBoxOU_listbox li span",
        ou[0]
      ),
  });

  // Delete record
  await sideMenu.clickBtnDelete();
}
