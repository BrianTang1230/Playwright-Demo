import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";
import Login from "@utils/data/uidata/loginData.json";

export async function DailyPieceRateWorkCreate(
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
  const region = process.env.REGION || Login.Region;

  await runStep("Create new transaction", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "#divComboOU .k-dropdown .k-select",
      "#ddlOU_listbox span",
      ou[0]
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  });

  await runStep("Add new grid item", async () => {
    await page.locator("#btnNewItem").click();
  });

  await runStep("Create grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      if (i === 1) await page.locator("#btnNewDWItem").click();
      if (i === 2) {
        await page.locator("#tabstripworkDet li").nth(1).click();
        await page.locator("#btnNewPRWItem").click();
      }

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
    return await getUiValues(
      page,
      region === "IND" ? paths.slice(0, 4) : paths
    );
  });

  console.log("UI Values:", uiVals);

  await runStep("Click on tab 1", async () => {
    await page.locator("#tabstripworkDet li").first().click();
  });

  const gridVals1 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(0, 2),
      cellsIndex.slice(0, 2)
    );
  });

  await runStep("Click on tab 2", async () => {
    await page.locator("#tabstripworkDet li").nth(1).click();
  });

  const gridVals2 = await runStep("Get created grid UI values", async () => {
    return await getGridValues(
      page,
      gridPaths.slice(2, 3),
      cellsIndex.slice(2, 3)
    );
  });

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function DailyPieceRateWorkEdit(
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
  const region = process.env.REGION || Login.Region;

  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await page.locator("#IsSelectGrid").check();
  await page.locator("#btnDeleteItem").click();
  await sideMenu.confirmDelete.click();
  await sideMenu.btnAddNewItem.click();

  for (let i = 0; i < gridPaths.length; i++) {
    if (i === 1) {
      await page.locator("#tabstripworkDet li").first().click();
      await page.locator("#btnNewDWItem").click();
    }
    if (i === 2) {
      await page.locator("#tabstripworkDet li").nth(1).click();
      await page.locator("#btnNewPRWItem").click();
    }
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.clickBtnSave();

  await page.locator("#tabstripworkDet li").first().click();
  const uiVals = await getUiValues(
    page,
    region === "IND" ? paths.slice(0, 4) : paths
  );
  const gridVals1 = await getGridValues(
    page,
    gridPaths.slice(0, 2),
    cellsIndex.slice(0, 2)
  );

  await page.locator("#tabstripworkDet li").nth(1).click();
  const gridVals2 = await getGridValues(
    page,
    gridPaths.slice(2, 3),
    cellsIndex.slice(2, 3)
  );

  const gridVals = [...gridVals1, ...gridVals2];

  return { uiVals, gridVals };
}

export async function DailyPieceRateWorkDelete(
  page,
  sideMenu,
  values,
  newValues,
  ou,
  docNo
) {
  await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);

  await sideMenu.clickBtnDelete();
}
