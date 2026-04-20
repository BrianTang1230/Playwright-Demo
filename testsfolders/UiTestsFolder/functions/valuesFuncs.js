import { GetElementByPath } from "./comFuncs";
import { parse } from "path";
import Data from "@utils/data/uidata/loginData.json";

const region = process.env.REGION || Data.Region;

export async function ValidateFormValues(InputFormValues, columns, uiValues) {
  console.log("\nUI Values:\n" + "-".repeat(74));

  for (let i = 0; i < InputFormValues.length; i++) {
    if (
      InputFormValues[i] === "NA" ||
      InputFormValues[i] === "AF" ||
      uiValues[i] === "NA"
    )
      continue;

    if (columns[i].includes("numeric")) {
      const inpVal = normalizeNumber(String(InputFormValues[i]));
      const uiVal = normalizeNumber(String(uiValues[i]));
      InputFormValues[i] = String(inpVal);
      uiValues[i] = String(uiVal);
    }

    if (InputFormValues[i] !== uiValues[i]) {
      throw new Error(
        `Mismatch UI values of ${columns[i]}: ${InputFormValues[i]} !== ${uiValues[i]}`,
      );
    } else {
      console.log(
        `Matched UI values of ${columns[i]}: ${InputFormValues[i]} === ${uiValues[i]}`,
      );
    }
  }
}

export async function ValidateDBValues(InputFormValues, inputCols, dbValues) {
  console.log("\nDB Values:\n" + "-".repeat(74));

  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];

    if (InputFormValues[i] === "NA" || InputFormValues[i] === "AF") continue;
    if (inputCols[i].includes("numeric")) {
      InputFormValues[i] = normalizeNumber(InputFormValues[i]);
    }

    if (
      String(InputFormValues[i]).trim() !== String(dbValues[colName]).trim()
    ) {
      throw new Error(
        `Mismatch DB values of ${colName}: ${InputFormValues[i]} !== ${dbValues[colName]}`,
      );
    } else {
      console.log(
        `Matched DB values of ${colName}: ${InputFormValues[i]} === ${dbValues[colName]}`,
      );
    }
  }
}

export async function ValidateGridValues(eValues, gValues) {
  if (eValues.length !== gValues.length) {
    // console.log(eValues, eValues.length);
    // console.log(gValues, gValues.length);
    throw new Error("Mismatch length in Grid values.");
  }

  console.log("\nGrid Values:\n" + "-".repeat(74));

  for (let i = 0; i < gValues.length; i++) {
    let expected = eValues[i];
    let actual = gValues[i];

    if (expected === "NA" || expected === "AF" || actual === "NA") continue;

    if (!isNaN(normalizeNumber(expected))) {
      actual = normalizeNumber(actual).toString();
      expected = normalizeNumber(expected).toString();
    }

    if (actual === expected) {
      console.log(`Matched Grid values: ${actual} === ${expected}`);
    } else {
      throw new Error(`Mismatch Grid values： ${actual} !== ${expected}.`);
    }
  }
}

function normalizeNumber(raw) {
  let cleaned = raw;
  if (region === "MY") {
    cleaned = cleaned.replaceAll(",", "");
  } else if (region === "IND") {
    cleaned = cleaned.replaceAll(".", "").replace(",", ".");
  }
  return Number(cleaned);
}

// Input values based on the column type

export async function InputFormValues(page, path, col, value) {
  if (value == "NA" || value == "AF") {
    return;
  }

  col = col.toLowerCase();
  const element = await GetElementByPath(page, path);
  if (!element) throw new Error("Element not found");
  else await element.focus();

  if (col.includes("k-drop")) {
    await element.click();
    await page
      .locator(`${path}_listbox li`, { hasText: value })
      .first()
      .click();
  }

  // Checkbox Input
  else if (col.includes("checkbox")) {
    if (value.toLowerCase() === "true") {
      await element.check();
    } else if (value.toLowerCase() === "false") {
      await element.uncheck();
    }
  }

  // Button Input
  else if (col.includes("button")) {
    await element.click();
  }

  // Integer,Date,Text Input
  else if (col.includes("text") || col.includes("date")) {
    await element.fill(value);
    await element.press("Enter");
  }

  // Numeric Input
  else if (col.includes("numeric")) {
    await element.press("Backspace");
    await element.type(value);
  }

  // All elements which have dropdown menu
  else if (col.includes("dropdown")) {
    await element.fill("");
    await element.type(value);
    await element.press("Enter");
  }

  // For dropdown with no text input
  else if (col.includes("combobox")) {
    await element.click();
    await page
      .locator('ul[role="listbox"] li', { hasText: value })
      .first()
      .click();
  }

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function InputGridValuesSameCols(page, path, values, cellsIndex) {
  const table = page.locator(path);
  const vals = values.split(";");
  const row = table.locator("tr").nth(0);

  for (let i = 0; i < cellsIndex.length; i++) {
    if (vals[i] === "NA" || vals[i] === "AF") continue;

    const cell = row.locator("td").nth(cellsIndex[i]);

    await cell.click();

    const input = cell.locator("input").first();

    if (vals[i].toLowerCase() === "true") {
      await input.check();
      continue;
    } else if (vals[i].toLowerCase() === "false") {
      await input.uncheck();
      continue;
    }

    if (
      vals[i] === "RW" ||
      vals[i] === "PR" ||
      vals[i] === "NW" ||
      vals[i] === "HA"
    ) {
      await input.fill("");
    }

    await input.press("Control+A");
    await input.press("Control+A");
    await input.press("Backspace");
    await input.type(vals[i]);
    await input.press("Enter");
  }
}

// Get values from UI based on the paths provided

export async function getFormValues(page, paths) {
  const uiValues = [];
  for (let i = 0; i < paths.length; i++) {
    const inputPath = await GetElementByPath(page, paths[i]);
    const tagName = (
      await inputPath.evaluate((el) => el.tagName)
    ).toLowerCase();
    const typeAttr = (await inputPath.getAttribute("type")) || "";

    // if checkbox
    if (typeAttr === "checkbox") {
      const isChecked = await inputPath.isChecked();
      isChecked ? uiValues.push("True") : uiValues.push("False");
    } else if (["input", "textarea", "select"].includes(tagName)) {
      const value = await inputPath.inputValue();
      uiValues.push(value && value.trim() !== "" ? value.trim() : "NA");
    } else {
      const text = await inputPath.innerText();
      uiValues.push(text && text.trim() !== "" ? text.trim() : "NA");
    }
  }
  return uiValues;
}

export async function getGridValues(page, gridPaths, cellsIndex) {
  const gridValues = [];
  for (let i = 0; i < gridPaths.length; i++) {
    const table = page.locator(gridPaths[i]);
    const row = table.locator("tr").first();

    for (let j = 0; j < cellsIndex[i].length; j++) {
      const cell = row.locator("td").nth(cellsIndex[i][j]);

      const checkbox = cell.locator('input[type="checkbox"]');

      if ((await checkbox.count()) > 0) {
        const isChecked = await checkbox.isChecked();
        gridValues.push(isChecked ? "True" : "False");
      } else {
        const gridValue = await cell.innerText();
        if (gridValue === "") {
          gridValues.push("NA");
        } else {
          gridValues.push(gridValue.trim());
        }
      }
    }
  }
  return gridValues;
}
