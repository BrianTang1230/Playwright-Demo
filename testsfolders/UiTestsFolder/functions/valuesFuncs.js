import {
  getElementByPath,
  throwTestFailMsg,
  getCurrForm,
  getCurrPhase,
} from "./comFuncs";
import { parse } from "path";
import Data from "@utils/data/uidata/loginData.json";

const region = process.env.REGION || Data.Region;
let currForm = "";
let currPhase = "";

function updateCurrFormAndPhase() {
  currForm = getCurrForm();
  currPhase = getCurrPhase();
}

export async function validateFormValues(inputValues, columns, uiValues) {
  updateCurrFormAndPhase();
  console.log(`\nUI Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < inputValues.length; i++) {
    if (
      String(inputValues[i]).trim() === "NA" ||
      String(inputValues[i]).trim() === "AF" ||
      String(uiValues[i]).trim() === "NA"
    )
      continue;

    if (columns[i].includes("numeric")) {
      const inpVal = normalizeNumber(String(inputValues[i]).trim());
      const uiVal = normalizeNumber(String(uiValues[i]).trim());
      inputValues[i] = String(inpVal);
      uiValues[i] = String(uiVal);
    }

    if (String(inputValues[i]).trim() !== String(uiValues[i]).trim()) {
      throwTestFailMsg(
        `${currPhase}-UI-MM`,
        currForm,
        `${columns[i]}: ${inputValues[i]} !== ${uiValues[i]}`,
      );
    } else {
      console.log(
        `Matched UI values of ${columns[i]}: ${inputValues[i]} === ${uiValues[i]}`,
      );
    }
  }
}

export async function validateDBValues(inputValues, inputCols, dbValues) {
  updateCurrFormAndPhase();
  console.log(`\nDB Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];

    if (
      String(inputValues[i]).trim() === "NA" ||
      String(inputValues[i]).trim() === "AF" ||
      dbValues[colName] === null
    )
      continue;

    if (inputCols[i].includes("numeric")) {
      inputValues[i] = normalizeNumber(String(inputValues[i]).trim());
    }

    if (String(inputValues[i]).trim() !== String(dbValues[colName]).trim()) {
      throwTestFailMsg(
        `${currPhase}-DB-MM`,
        currForm,
        `${inputValues[i]} !== ${dbValues[colName]} (${colName})`,
      );
    } else {
      console.log(
        `Matched DB values of ${colName}: ${inputValues[i]} === ${dbValues[colName]}`,
      );
    }
  }
}

export async function validateGridValues(inputValues, gridValues) {
  updateCurrFormAndPhase();
  if (inputValues.length !== gridValues.length) {
    throwTestFailMsg(
      `${currPhase}-GRID-DI`,
      currForm,
      `${inputValues.length} !== ${gridValues.length}`,
    );
  }

  console.log(`\nGrid Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < gridValues.length; i++) {
    let expected = String(inputValues[i]).trim();
    let actual = String(gridValues[i]).trim();

    if (expected === "NA" || expected === "AF" || actual === "NA") continue;

    if (!isNaN(normalizeNumber(expected))) {
      actual = normalizeNumber(actual);
      expected = normalizeNumber(expected);
    }

    if (String(actual) === String(expected)) {
      console.log(`Matched Grid values: ${actual} === ${expected}`);
    } else {
      throwTestFailMsg(
        `${currPhase}-GRID-MM`,
        currForm,
        `${actual} !== ${expected} ()`,
      );
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

export async function inputFormValues(page, path, col, value) {
  if (value == "NA" || value == "AF") {
    return;
  }

  col = col.toLowerCase();
  const element = await getElementByPath(page, path);
  await element.focus();

  try {
    if (col.includes("k-drop")) {
      await element.click();
      await page
        .locator(`${path}_listbox li`, { hasText: value })
        .first()
        .click();
    }

    // Invisible k-drop Input
    else if (col.includes("k-hidden-drop")) {
      const dropdownWrapper = element.locator("..");
      await dropdownWrapper.click({ force: true });
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

    await page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
  } catch (error) {
    await updateCurrFormAndPhase();
    throwTestFailMsg(
      `${currPhase}-UI-NF`,
      currForm,
      `${col} with value ${value} at ${path}`,
    );
  }
}

export async function inputGridValues(
  page,
  path,
  values,
  cellsIndex,
  nRow = 0,
  options = {},
) {
  const table = page.locator(path);
  const vals = values.split(";");

  let targetRow = nRow;
  if (options.hasAutoFill === true) {
    targetRow = nRow + 1;
  }
  const row = path.includes("tr[") ? table : table.locator("tr").nth(targetRow);

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
    const element = await getElementByPath(page, paths[i]);

    const value = await element.evaluate((el) => {
      const tag = el.tagName.toLowerCase();
      const type = (el.getAttribute("type") || "").toLowerCase();

      // ✅ checkbox / radio
      if (type === "checkbox" || type === "radio") {
        return el.checked ? "True" : "False";
      }

      // ✅ Kendo DatePicker / UI widget
      if (el.getAttribute("data-role") === "datepicker") {
        const widget = $(el).data("kendoDatePicker");
        if (!widget) return "NA";

        const value = widget.value();
        if (!value) return "NA";

        const format = widget.options.format || "MMMM yyyy";
        return kendo.toString(value, format);
      }

      // ✅ input / textarea / select
      if (tag === "input" || tag === "textarea" || tag === "select") {
        const v = el.value;
        return v && v.trim() !== "" ? v.trim() : "NA";
      }

      // ✅ fallback
      const text = el.innerText || el.textContent;
      return text && text.trim() !== "" ? text.trim() : "NA";
    });

    uiValues.push(value);
  }

  return uiValues;
}

export async function getGridValues(
  page,
  gridPaths,
  cellsIndex,
  options = { hasAutoFill: false, isOneRow: false },
) {
  const gridValues = [];
  for (let i = 0; i < gridPaths.length; i++) {
    const table = page.locator(gridPaths[i]);

    // 1. THE CONFIG FIX: Offset the row dynamically based on your options object!
    let row;
    if (gridPaths[i].includes("tr[")) {
      row = table;
    } else if (options.isOneRow) {
      row = table.locator("tr").first();
    } else {
      // If hasAutoFill is true, shift down by 1 (i + 1) to skip the auto-generated row.
      // If false, use 'i' to grab the normal rows in sequence
      const targetRow = options.hasAutoFill ? i + 1 : i;
      row = table.locator("tr").nth(targetRow);
    }

    const currentCellsIndex = cellsIndex[i];

    for (let j = 0; j < currentCellsIndex.length; j++) {
      const cell = row.locator("td").nth(currentCellsIndex[j]);

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
