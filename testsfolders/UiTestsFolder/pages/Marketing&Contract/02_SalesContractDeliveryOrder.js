import { runStep, SelectOU } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionBy3Criterias,
} from "@UiFolder/functions/OpenRecord";

export async function SalesContractDeliveryOrderCreate(
  page,
  sideMenu,
  paths,
  columns,
  values,
  ou,
) {
  await runStep("Open create new form", async () => {
    await sideMenu.clickBtnCreateNewForm();
  });

  await runStep("Select OU", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
      if (i === 8) {
        await page.getByRole("tab", { name: "Delivery", exact: true }).click();
      }
    }
    await page.getByRole("tab", { name: "General" }).click();
  });

  await runStep("Save transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = [];

  await runStep("Get created UI values", async () => {
    for (let i = 0; i < paths.length; i++) {
      uiVals.push(await getFormValues(page, [paths[i]]));
      if (i === 8) {
        await page.getByRole("tab", { name: "Delivery", exact: true }).click();
      }
    }
  });

  return { uiVals };
}

export async function SalesContractDeliveryOrderEdit1(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy3Criterias(
      page,
      values[1],
      ou[0],
      docNo,
      "DO ID.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
      if (i === 11) {
        await page.getByRole("tab", { name: "Delivery", exact: true }).click();
      }
    }
    await page.getByRole("tab", { name: "General" }).click();
  });

  await runStep("Close edited transaction without save", async () => {
    await sideMenu.clickBtnClose();
    await sideMenu.rejectBtn.click();
  });

  await runStep("Reopen transaction", async () => {
    await FilterForUnsaveChecking(page, values[0]);
  });

  const uiVals = [];
  await runStep("Get edited UI values", async () => {
    for (let i = 0; i < paths.length; i++) {
      uiVals.push(await getFormValues(page, [paths[i]]));
      if (i === 11) {
        await page.getByRole("tab", { name: "Delivery", exact: true }).click();
      }
    }
  });

  return { uiVals };
}

export async function SalesContractDeliveryOrderEdit2(
  page,
  sideMenu,
  paths,
  columns,
  values,
  newValues,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy3Criterias(
      page,
      values[1],
      ou[0],
      docNo,
      "DO ID.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
      if (i === 11) {
        await page.getByRole("tab", { name: "Delivery", exact: true }).click();
      }
    }
    await page.getByRole("tab", { name: "General" }).click();
  });

  await runStep("Save edited transaction", async () => {
    await sideMenu.clickBtnSave();
  });

  const uiVals = [];
  await runStep("Get edited UI values", async () => {
    for (let i = 0; i < paths.length; i++) {
      uiVals.push(await getFormValues(page, [paths[i]]));
      if (i === 11) {
        await page.getByRole("tab", { name: "Delivery", exact: true }).click();
      }
    }
  });

  return { uiVals };
}

export async function SalesContractDeliveryOrderDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy3Criterias(
      page,
      values[1],
      ou[0],
      docNo,
      "DO ID.",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
