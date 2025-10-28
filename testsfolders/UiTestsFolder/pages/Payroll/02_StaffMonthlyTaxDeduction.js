import { SelectOU } from "@UiFolder/functions/comFuncs";
import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import {
  InputGridValuesSameCols,
  InputValues,
} from "@UiFolder/functions/InputValues";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";

export async function StaffMonthlyTaxDeductionCreate(
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
    "#divComboOU .k-dropdown .k-select",
    "ul[aria-hidden='false'] li span",
    ou[0]
  );

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  await page.locator("#btnNewItem").click();

  for (let i = 0; i < gridPaths.length; i++) {
    if (i === 1) await page.locator("#btnNewBIK").click();
    if (i === 2) {
      await page.locator("#prTabstripworkDet li").nth(1).click();
      await page.locator("#btnNewDeduct").click();
    }
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#prTabstripworkDet li").first().click();
  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(
    page,
    gridPaths.slice(0, 2),
    cellsIndex.slice(0, 2)
  );

  await page.locator("#prTabstripworkDet li").nth(1).click();
  const gridVals2 = await getGridValues(
    page,
    gridPaths.slice(2, 3),
    cellsIndex.slice(2, 3)
  );

  return [uiVals, [...gridVals, ...gridVals2]];
}

export async function StaffMonthlyTaxDeductionEdit(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridPaths,
  gridValues,
  cellsIndex,
  ou
) {
  await FilterRecordByOUAndDate(page, values, ou[0], values[2], 5);

  for (let i = 0; i < paths.slice(0, 3).length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  await page.locator("#IsPREmpySelect").check();
  await page.locator("#btnDeleteItem").click();

  await sideMenu.confirmDelete.click();

  await page.locator("#btnNewItem").click();

  for (let i = 0; i < gridPaths.length; i++) {
    if (i === 1) await page.locator("#btnNewBIK").click();
    if (i === 2) {
      await page.locator("#prTabstripworkDet li").nth(1).click();
      await page.locator("#btnNewDeduct").click();
    }
    await InputGridValuesSameCols(
      page,
      gridPaths[i],
      gridValues[i],
      cellsIndex[i]
    );
  }

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#prTabstripworkDet li").first().click();
  const uiVals = await getUiValues(page, paths);
  const gridVals = await getGridValues(
    page,
    gridPaths.slice(0, 2),
    cellsIndex.slice(0, 2)
  );

  await page.locator("#prTabstripworkDet li").nth(1).click();
  const gridVals2 = await getGridValues(
    page,
    gridPaths.slice(2, 3),
    cellsIndex.slice(2, 3)
  );

  return [uiVals, [...gridVals, ...gridVals2]];
}

export async function StaffMonthlyTaxDeductionDelete(
  page,
  sideMenu,
  values,
  newValues,
  ou
) {
  await FilterRecordByOUAndDate(page, values, ou[0], newValues[2], 5);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}
