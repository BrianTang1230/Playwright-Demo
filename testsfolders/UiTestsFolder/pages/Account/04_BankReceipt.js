import { SelectOU, runStep, buildGridRows, getUniversalDate } from "@UiFolder/functions/comFuncs";
import {
    inputGridValues,
    inputFormValues,
    getGridValues,
    getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByFiscalYearAndPeriod } from "@UiFolder/functions/OpenRecord";
import Login from "@utils/data/uidata/loginData.json";

// Create
export async function BankReceiptCreate(
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
  const GridRows = buildGridRows(gridValues, cellsIndex);

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
        if (typeof values[i] === "string") {
            values[i] = values[i].replace(/\[TODAY\]/g, getUniversalDate());
        }

        await inputFormValues(page, paths[i], columns[i], values[i]);
      }
    });

    await runStep("Create grid item", async () => {
      for (let i = 0; i < GridRows.length; i++) {
        await sideMenu.btnAddNewItem.click();
        await page.waitForTimeout(500);

        await inputGridValues(page, gridPaths[0], GridRows[i], cellsIndex[0], i);
      };
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
      const pathsToScrape = Array(GridRows.length).fill(gridPaths[0]);
        return await getGridValues(page, pathsToScrape, cellsIndex, { hasAutoFill: true });
    });

    return { uiVals, gridVals };
}

// Edit
export async function BankReceiptEdit(
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

  if (typeof fiscalYear === "string") {
    fiscalYear = fiscalYear.replace(/\[YEAR\]/g, getUniversalDate({ format: 'YYYY' }));
  }
  
  if (typeof period === "string") {
    period = period.replace(/\[MONTH\]/g, getUniversalDate({ format: 'MM' })); 
  }

  const GridRows = buildGridRows(gridValues, cellsIndex);

  await runStep("Filter transaction", async () => {
    await FilterRecordByFiscalYearAndPeriod(page, fiscalYear, period, docNo);
  });


  await runStep("Edit transaction", async () => {
    await page.waitForTimeout(10000);
    for (let i = 0; i < paths.length; i++) {
      if (typeof editValues[i] === "string") {
        editValues[i] = editValues[i].replace(/\[TODAY\+1\]/g, getUniversalDate({ days: 1 }));
      }

      await inputFormValues(page, paths[i], columns[i], editValues[i]);
    }
  });

  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelectGrid").nth(2).check();
    await page.locator("#btnDeleteAll").click();
    await sideMenu.confirmBtn.click();
    await sideMenu.btnAddNewItem.click();
  });

  await runStep("Edit grid item", async () => {
    for (let i = 0; i < GridRows.length; i++) {
      const currentPath = gridPaths[i] || gridPaths[0];
      const currentIndex = cellsIndex[i] || cellsIndex[0];
      await inputGridValues(page, currentPath, GridRows[i], currentIndex, i, { hasAutoFill: true});
    }
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  }); 

  const uiVals = await runStep("Get edited UI values", async () => {
    return await getFormValues(page, paths);
  });

  const gridVals = await runStep("Get edited grid UI values", async () => {
    const pathsToScrape = Array(GridRows.length).fill(gridPaths[0]);
    return await getGridValues(page, pathsToScrape, cellsIndex, { hasAutoFill: true });
  });

  return { uiVals, gridVals };
}