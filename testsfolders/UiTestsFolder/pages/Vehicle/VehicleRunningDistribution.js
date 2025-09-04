import { InputGridValues, InputValues } from "@UiFolder/functions/InputValues";
import { FilterRecord, SelectRecord } from "@UiFolder/functions/OpenRecord";
import getValues from "@UiFolder/functions/GetValues";

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

  await page.locator(".k-loading-image").waitFor({ state: "detached" });

  await page.locator("#divComboOU .k-dropdown-wrap .k-select").click();
  await page
    .locator("#comboBoxOU_listbox span", { hasText: ou })
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
