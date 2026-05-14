import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
    inputGridValues,
    inputFormValues,
    getGridValues,
    getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByFiscalYearAndPeriod } from "@UiFolder/functions/OpenRecord";
import Login from "@utils/data/uidata/loginData.json";

// Create
export async function ClosedPeriodAdjustmentCreate(
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
        "#divComboOU .k-dropdown-wrap .k-select",
        "#comboBoxOU_listbox span",
        ou[0]
      );
    });

    await runStep("Input transaction data", async () => {
      for (let i = 0; i < paths.length; i++) {
        await inputFormValues(page, paths[i], columns[i], values[i]);
      }
    });

    await runStep("Create grid item", async () => {
      for (let i = 0; i < gridPaths.length; i++) {

        await sideMenu.btnAddNewItem.click();
        await page.waitForTimeout(500);

        await inputGridValues(page, gridPaths[0], gridValues[i], cellsIndex[i], i);
      }
    });

    await runStep("Save transaction", async () => {
        await sideMenu.clickBtnSave();
    });

    const uiVals = await runStep("Get created UI values", async () => {
        return await getFormValues(
          page, 
          paths,
        );
    });

    const gridVals = await runStep("Get created grid values", async () => {
        // Retrieves data from all rows created
        return await getGridValues(
            page, 
            gridPaths,
            cellsIndex,
        );
    });

    return { uiVals, gridVals };
}

// Edit
export async function ClosedPeriodAdjustmentEdit(
    page,
    sideMenu,
    paths,
    columns,
    editValues,
    gridPaths,
    gridValues,
    cellsIndex,
    ou,
    docNo,
    fiscalYear,
    period
) {

  await runStep("Filter transaction", async () => {
    await FilterRecordByFiscalYearAndPeriod(page, fiscalYear, period, docNo);
  });

  await runStep("Edit transaction", async () => {
    await page.waitForTimeout(6000);
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], editValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelectGrid").nth(2).check();
    await page.locator("#btnDeleteItem").click();
    await sideMenu.confirmBtn.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < gridPaths.length; i++) {
      await inputGridValues(page, gridPaths[i], gridValues[i], cellsIndex[i]);
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get edited grid UI values", async () => {
    return await getGridValues(page, gridPaths, cellsIndex);
  });

  return { uiVals, gridVals };
}