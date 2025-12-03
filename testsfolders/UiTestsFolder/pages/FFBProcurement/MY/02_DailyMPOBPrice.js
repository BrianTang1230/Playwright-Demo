import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import {
  FilterRecordByOU,
  FilterRecordByOUAndDate,
} from "@UiFolder/functions/OpenRecord";

export async function DailyMPOBPriceCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex,
  ou
) {
  await sideMenu.clickBtnCreateNewForm();

  await SelectOU(
    page,
    "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
    "#comboBoxOU_listbox li span",
    ou[0]
  );

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.getByRole("button", { name: " Populate Day" }).click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function DailyMPOBPriceEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridValues,
  cellsIndex,
  ou,
  docNo
) {
  await FilterRecordByOU(
    page,
    values[0].split(" ")[1],
    ou[0],
    values[1],
    [2, 4]
  );

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function DailyMPOBPriceDelete(page, sideMenu, values, ou, docNo) {
  await FilterRecordByOU(
    page,
    values[0].split(" ")[1],
    ou[0],
    values[1],
    [2, 4]
  );

  await sideMenu.clickBtnDelete();
}
