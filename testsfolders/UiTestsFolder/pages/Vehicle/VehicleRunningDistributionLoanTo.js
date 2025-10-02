import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord, SelectRecord } from "@UiFolder/functions/OpenRecord";
import getValues from "@UiFolder/functions/GetValues";

export async function VehicleRunningDistributionLoanToCreate(
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

  await page.waitForTimeout(2000);

  await page.locator("#comboOU .k-dropdown-wrap .k-select").first().click();
  await page
    .locator("#comboBoxOU_listbox li span", { hasText: ou[0] })
    .first()
    .click();

  await page.locator("#comboToOU .k-dropdown-wrap .k-select").first().click();
  await page
    .locator("#comboBoxToOU_listbox li span", { hasText: ou[1] })
    .first()
    .click();

  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    console.error(paths, columns, values);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  await page.locator("#btnNewItem").click();

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.btnSave.click();

  return getValues(page, paths, gridPaths, cellsIndex);
}

export async function VehicleRunningDistributionLoanToEdit(
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
  await FilterRecord(page, values, ou[0], docNo, 2);

  if (paths.length == columns.length && columns.length == newValues.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  } else {
    console.error(paths, columns, newValues);
    throw new Error("Paths, columns, and values do not match in length.");
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.btnSave.click();

  return getValues(page, paths, gridPaths, cellsIndex);
}

export async function VehicleRunningDistributionLoanToDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo
) {
  await FilterRecord(page, values, ou[0], docNo, 2);

  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}
