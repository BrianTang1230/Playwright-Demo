import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import {
    inputGridValues,
    inputFormValues,
    getGridValues,
    getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { FilterRecordByOUAndDate } from "@UiFolder/functions/OpenRecord";
import Login from "@utils/data/uidata/loginData.json";

// Create
export async function GeneralJournalCreate(
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

            // Passes the 'i' index so it handles multiple rows if gridValues > 1
            await inputGridValues(page, gridPaths[0], gridValues[i], cellsIndex[0], i);
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
export async function GeneralJournalEdit(
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
        await FilterRecordByOUAndDate(page, values, ou[0], docNo, 4);
    });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  // Check this step for your specific General Journal Grid UI
  await runStep("Delete and add new grid item", async () => {
    await page.locator("#IsSelectGrid").first().check();
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

export async function GeneralJournalDelete(
  db,
  deleteSQL,
  docNo,
  ou
) {
  // Since Account has no UI Delete button, we use the SQL cleanup logic directly
  await runStep("Delete transaction via SQL", async () => {
    await db.deleteData(deleteSQL, {
      DocNo: docNo,
      OU: ou[0]
    });
  });
}