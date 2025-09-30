import { getGridValues, getUiValues } from "@UiFolder/functions/GetValues";
import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecordByOU } from "@UiFolder/functions/OpenRecord";

export async function StaffPreviousEmploymentTaxDeductionCreate(
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
  await sideMenu.btnCreateNewForm.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

  await page.locator("#divComboOU .k-dropdown .k-select").first().click();
  await page
    .locator("ul[aria-hidden='false'] li span", { hasText: ou[0] })
    .first()
    .click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });

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
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
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

export async function StaffPreviousEmploymentTaxDeductionEdit(
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
  await FilterRecordByOU(page, values, ou[0], values[2], 5);

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
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
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

export async function StaffPreviousEmploymentTaxDeductionDelete(
  page,
  sideMenu,
  values,
  newValues,
  ou
) {
  await FilterRecordByOU(page, values, ou[0], newValues[2], 5);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}
