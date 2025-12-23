import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function InterOUCropHarvestingCreate(
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
  await runStep("Create new transaction", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU and Loan to OU", async () => {
    await SelectOU(
      page,
      "div.viewModeOU.pinOU .k-dropdown .k-select >> nth=0",
      "ul[aria-hidden='false'] li span",
      ou[0]
    );

    await SelectOU(
      page,
      "div.viewModeOU.pinOU .k-dropdown .k-select >> nth=1",
      "ul[aria-hidden='false'] li span",
      ou[1]
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.slice(0, 7).length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add grid and block code", async () => {
    await sideMenu.btnAddNewItem.click();
    await page.locator('[name="comboBoxBlock_input"]').type(values[7]);
    await page.keyboard.press("Tab");
    await page.locator("#btnAddBlock").click();
  });

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await InputGridValuesSameCols(
        page,
        gridPaths[i],
        gridValues[i],
        cellsIndex[i]
      );
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get created UI values", async () => {
    return await getUiValues(page, paths);
  });

  const gridVals = await runStep("Get created grid UI values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex);
  });

  return { uiVals, gridVals };
}

export async function InterOUCropHarvestingEdit(
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
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], docNo, 3);
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await InputGridValuesSameCols(
        page,
        gridPaths[i],
        gridValues[i],
        cellsIndex[i]
      );
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getUiValues(page, paths);
  });

  const gridVals = await runStep("Get edited grid UI values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex);
  });

  return { uiVals, gridVals };
}

export async function InterOUCropHarvestingDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await runStep("Filter transaction", async () => {
    await FilterRecordByOUAndDate(page, values, ou[0], docNo, 3);
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
