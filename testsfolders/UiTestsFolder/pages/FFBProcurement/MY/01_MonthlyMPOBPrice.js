import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterRecordByOU,
  FilterRecordByOUAndDate,
} from "@UiFolder/functions/OpenRecord";

export async function MonthlyMPOBPriceCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridPaths,
  gridValues,
  cellsIndex,
  ou,
) {
  await runStep("Open create new form", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
      "#comboBoxOU_listbox",
      ou[0],
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Populate grid item", async () => {
    await page.getByRole("button", { name: " Populate Month" }).click();
  });

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex);
  });

  return { uiVals, gridVals };
}

export async function MonthlyMPOBPriceEdit1(
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
) {
  await FilterRecordByOU(page, values[0], ou[0], values[1], [2, 3]);

  for (let i = 0; i < paths.length; i++) {
    await inputFormValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.clickBtnSave();

  const uiVals = await getFormValues(page, paths);
  const gridVals = await getGridValues(page, gridPaths, cellsIndex);

  return { uiVals, gridVals };
}

export async function MonthlyMPOBPriceDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await FilterRecordByOU(page, values[0], ou[0], values[1], [2, 3]);

  await sideMenu.clickBtnDelete();
}
