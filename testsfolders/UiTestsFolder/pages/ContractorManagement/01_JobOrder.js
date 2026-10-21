import {
  SelectOU,
  getUniversalDate,
  runStep,
} from "@UiFolder/functions/comFuncs";
import {
  inputFormValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import { expect } from "@playwright/test";
import {
  FilterForUnsaveChecking,
  FilterTransactionByFixedUQF,
} from "@UiFolder/functions/OpenRecord";

export async function JobOrderCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  gridValues,
  ou,
) {
  await runStep("Open create new form", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    await SelectOU(
      page,
      "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
      "#comboBoxOU_listbox li",
      ou[0],
    );
  });

  const paths1 = paths.slice(0, 13);
  const columns1 = columns.slice(0, 13);
  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths1.length; i++) {
      if (typeof values[i] === "string") {
        values[i] = values[i].replace(/\[TODAY\]/g, getUniversalDate());
        values[i] = values[i].replace(
          /\[TODAY\+1]/g,
          getUniversalDate({ days: 1 }),
        );
        values[i] = values[i].replace(
          /\[TODAY\+5]/g,
          getUniversalDate({ days: 5 }),
        );
      }
      await inputFormValues(page, paths1[i], columns1[i], values[i]);
    }
  });

  const paths2 = paths.slice(13, paths.length);
  const columns2 = columns.slice(13, paths.length);
  await runStep("Create item", async () => {
    await sideMenu.btnAddNewItem.click();
    for (let i = 0; i < paths2.length; i++) {
      await inputFormValues(
        page,
        paths2[i],
        columns2[i],
        gridValues[0].split(";")[i],
      );
    }
  });

  await runStep("Save item", async () => {
    await page.locator("#btnSaveRcd:visible").click();
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths1);
  });

  await runStep("Open item", async () => {
    await page.locator("button", { hasText: "Edit Item" }).click();
  });

  const gridVals = await runStep("Get Grid values", async () => {
    return await getFormValues(page, paths2);
  });

  return { uiVals, gridVals };
}

export async function JobOrderEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridValues,
  gridNewValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionByFixedUQF(
      page,
      ["OUCode_input", "JOFromDate", "JOToDate", "joNum"],
      [ou[0], values[0], values[0], docNo],
      1,
    );
  });

  const paths1 = paths.slice(0, 13);
  const columns1 = columns.slice(0, 13);
  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths1.length; i++) {
      if (typeof newValues[i] === "string") {
        newValues[i] = newValues[i].replace(
          /\[TODAY\+2]/g,
          getUniversalDate({ days: 2 }),
        );
        newValues[i] = newValues[i].replace(
          /\[TODAY\+6]/g,
          getUniversalDate({ days: 6 }),
        );
      }
      await inputFormValues(page, paths1[i], columns1[i], newValues[i]);
    }
  });

  const paths2 = paths.slice(13);
  const columns2 = columns.slice(13);
  await runStep("Edit grid item", async () => {
    await page.getByRole("button", { name: /Edit Item/ }).click();
    for (let i = 0; i < paths2.length; i++) {
      await inputFormValues(
        page,
        paths2[i],
        columns2[i],
        gridNewValues[0].split(";")[i],
      );
    }
  });

  await runStep("Save grid item", async () => {
    await page.locator("#btnSaveRcd:visible").click();
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, docNo);
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths1);
  });

  const gridVals = await runStep("Get Grid values", async () => {
    await page.getByRole("button", { name: /Edit Item/ }).click();
    return await getFormValues(page, paths2);
  });

  return { uiVals, gridVals };
}

export async function JobOrderEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  gridValues,
  gridNewValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionByFixedUQF(
      page,
      ["OUCode_input", "JOFromDate", "JOToDate", "joNum"],
      [ou[0], values[0], values[0], docNo],
      1,
    );
  });

  const paths1 = paths.slice(0, 13);
  const columns1 = columns.slice(0, 13);
  await runStep("Edit transaction data", async () => {
    for (let i = 0; i < paths1.length; i++) {
      if (typeof newValues[i] === "string") {
        newValues[i] = newValues[i].replace(
          /\[TODAY\+2]/g,
          getUniversalDate({ days: 2 }),
        );
        newValues[i] = newValues[i].replace(
          /\[TODAY\+6]/g,
          getUniversalDate({ days: 6 }),
        );
      }
      await inputFormValues(page, paths1[i], columns1[i], newValues[i]);
    }
  });

  const paths2 = paths.slice(13);
  const columns2 = columns.slice(13);
  await runStep("Edit grid item", async () => {
    await page.getByRole("button", { name: /Edit Item/ }).click();
    for (let i = 0; i < paths2.length; i++) {
      await inputFormValues(
        page,
        paths2[i],
        columns2[i],
        gridNewValues[0].split(";")[i],
      );
    }
  });

  await runStep("Save grid item", async () => {
    await page.locator("#btnSaveRcd:visible").click();
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = await runStep("Get UI values", async () => {
    return await getFormValues(page, paths.slice(0, 13));
  });

  const gridVals = await runStep("Get Grid values", async () => {
    await page.getByRole("button", { name: /Edit Item/ }).click();
    return await getFormValues(page, paths.slice(13));
  });

  return { uiVals, gridVals };
}
