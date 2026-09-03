import { SelectOU, runStep } from "@UiFolder/functions/comFuncs";
import { SelectRecord } from "@UiFolder/functions/OpenRecord";
import {
  inputFormValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";

// Create Function
export async function DepartmentSetupCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
) {
  await runStep("Open create new form", async () => {
    await sideMenu.btnNew.click();
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
    }
  });

  //tree path is the path thingy in masterdata.json

  //#deptouTreeView

  const treeID = '#deptouTreeView';
  let treeExcelInput = 'OIL PALM ESTATE/RAMIN ESTATE;HEAD OFFICE DEPARTMENT/ADMIN DEPARTMENT;HEAD OFFICE';
  let treeInput = treeExcelInput.split(';');

  await runStep("Create Tree item", async () => {

    for (const currentItem of treeInput) {
      let target;

      if (currentItem.includes('/')) {
        // Handles items with a path (Parent / Child)
        let [parentNode, childNode] = currentItem.split('/').map(node => node.trim());
        target = page.locator(`${treeID} li`, { hasText: parentNode })
                  .locator('li', { hasText: new RegExp(`^${childNode}$`) });
      } else {
        // Handles single-level items
        target = page.locator(`${treeID} .k-in`, { hasText: currentItem })
                  .locator('xpath=ancestor::li[1]');
      }

      await target.locator('input[type="checkbox"], .k-checkbox').first().click();
    }


  });


  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  await runStep("Reopen transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

// Edit Function
export async function DepartmentSetupEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Close edited transaction without save", async () => {
    await page.getByRole("button", { name: "Cancel" }).click();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await SelectRecord(page, sideMenu, values, "reopen");
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

export async function DepartmentSetupEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, values);
  });

  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
    }
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  await runStep("Reopen transaction", async () => {
    await SelectRecord(page, sideMenu, newValues);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths);
  });

  return { uiVals };
}

// Delete Function
export async function DepartmentSetupDelete(page, sideMenu, newValues) {
  await runStep("Open transaction", async () => {
    await SelectRecord(page, sideMenu, newValues, "delete");
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
