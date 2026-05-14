import { runStep, SelectOU } from "@UiFolder/functions/comFuncs";
import {
  inputGridValues,
  inputFormValues,
  getGridValues,
  getFormValues,
} from "@UiFolder/functions/valuesFuncs";
import {
  FilterForUnsaveChecking,
  FilterTransactionBy2And1Criterias,
} from "@UiFolder/functions/OpenRecord";

export async function SalesContractAllocationCreate(
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
    await SelectOU(
      page,
      "div.viewModeOU.pinOU .k-dropdown-wrap .k-select",
      "#ddlOU-list li",
      ou[0],
    );
  });

  await runStep("Input transaction data", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], values[i]);
      if (i === 8) {
        await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
      } else if (i === 16) {
        await page
          .getByRole("tab", { name: "Payment Terms and Delivery" })
          .click();
      } else if (i === 23) {
        await page.getByRole("tab", { name: "Remarks" }).click();
      } else if (i === 35) {
        await page.getByRole("tab", { name: "Despatch" }).click();
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
        await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
      } else if (i === 16) {
        await page
          .getByRole("tab", { name: "Payment Terms and Delivery" })
          .click();
      } else if (i === 23) {
        await page.getByRole("tab", { name: "Remarks" }).click();
      } else if (i === 35) {
        await page.getByRole("tab", { name: "Despatch" }).click();
      }
    }
  });

  return { uiVals };
}

export async function SalesContractAllocationEdit1(
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
    await FilterTransactionBy2And1Criterias(
      page,
      values[1],
      ou[0],
      values[0],
      "Our Contract No.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
      if (i === 8) {
        await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
      } else if (i === 16) {
        await page
          .getByRole("tab", { name: "Payment Terms and Delivery" })
          .click();
      } else if (i === 23) {
        await page.getByRole("tab", { name: "Remarks" }).click();
      } else if (i === 35) {
        await page.getByRole("tab", { name: "Despatch" }).click();
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
      if (i === 8) {
        await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
      } else if (i === 16) {
        await page
          .getByRole("tab", { name: "Payment Terms and Delivery" })
          .click();
      } else if (i === 23) {
        await page.getByRole("tab", { name: "Remarks" }).click();
      } else if (i === 35) {
        await page.getByRole("tab", { name: "Despatch" }).click();
      }
    }
  });

  return { uiVals };
}

export async function SalesContractAllocationEdit2(
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
    await FilterTransactionBy2And1Criterias(
      page,
      values[1],
      ou[0],
      values[0],
      "Our Contract No.",
    );
  });

  await runStep("Edit transaction", async () => {
    for (let i = 0; i < paths.length; i++) {
      await inputFormValues(page, paths[i], columns[i], newValues[i]);
      if (i === 8) {
        await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
      } else if (i === 16) {
        await page
          .getByRole("tab", { name: "Payment Terms and Delivery" })
          .click();
      } else if (i === 23) {
        await page.getByRole("tab", { name: "Remarks" }).click();
      } else if (i === 35) {
        await page.getByRole("tab", { name: "Despatch" }).click();
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
      if (i === 8) {
        await page.getByRole("tab", { name: "Quantity and Pricing" }).click();
      } else if (i === 16) {
        await page
          .getByRole("tab", { name: "Payment Terms and Delivery" })
          .click();
      } else if (i === 23) {
        await page.getByRole("tab", { name: "Remarks" }).click();
      } else if (i === 35) {
        await page.getByRole("tab", { name: "Despatch" }).click();
      }
    }
  });

  return { uiVals };
}

export async function SalesContractAllocationDelete(
  page,
  sideMenu,
  values,
  ou,
  docNo,
) {
  await runStep("Filter transaction", async () => {
    await FilterTransactionBy2And1Criterias(
      page,
      values[1],
      ou[0],
      values[0],
      "Our Contract No.",
    );
  });

  await runStep("Delete transaction", async () => {
    await sideMenu.clickBtnDelete();
  });
}
