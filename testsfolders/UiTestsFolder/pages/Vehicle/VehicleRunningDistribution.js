import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord } from "@UiFolder/functions/OpenRecord";

export async function VehicleRunningDistributionCreate(
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

  await page.locator("#divComboOU .k-dropdown-wrap .k-select").click();
  await page
    .locator("#comboBoxOU_listbox span", { hasText: ou[0] })
    .first()
    .click();

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], values[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function VehicleRunningDistributionEdit(
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

  for (let i = 0; i < paths.length; i++) {
    await InputValues(page, paths[i], columns[i], newValues[i]);
  }

  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
  }

  await sideMenu.btnSave.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function VehicleRunningDistributionDelete(
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
