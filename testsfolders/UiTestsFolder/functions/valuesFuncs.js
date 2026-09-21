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
  const localInputValues = [...inputValues];
  const localUiValues = [...uiValues];

  updateCurrFormAndPhase();
  console.log(`\nUI Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < localInputValues.length; i++) {
    if (
      String(localInputValues[i]).trim() === "NA" ||
      String(localInputValues[i]).trim() === "AF" ||
      String(localUiValues[i]).trim() === "NA"
    )
      continue;

    if (columns[i].includes("numeric")) {
      const inpVal = normalizeNumber(String(localInputValues[i]).trim());
      const uiVal = normalizeNumber(String(localUiValues[i]).trim());
      localInputValues[i] = String(inpVal);
      localUiValues[i] = String(uiVal);
    }

    if (
      String(localInputValues[i]).trim() !== String(localUiValues[i]).trim()
    ) {
      throwTestFailMsg(
        `${currPhase}-UI-MM`,
        currForm,
        `${columns[i]}: ${localInputValues[i]} !== ${localUiValues[i]}`,
      );
    } else {
      console.log(
        `Matched UI values of ${columns[i]}: ${localInputValues[i]} === ${localUiValues[i]}`,
      );
    }
  }
}

export async function validateDBValues(inputValues, inputCols, dbValues) {
  const localInputValues = [...inputValues];
  const localDbValues = dbValues;

  updateCurrFormAndPhase();
  console.log(`\nDB Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];

    if (
      String(localInputValues[i]).trim() === "NA" ||
      String(localInputValues[i]).trim() === "AF" ||
      dbValues[colName] === null
    )
      continue;

    if (inputCols[i].includes("numeric")) {
      localInputValues[i] = normalizeNumber(String(localInputValues[i]).trim());
    }

    if (
      String(localInputValues[i]).trim() !==
      String(localDbValues[colName]).trim()
    ) {
      throwTestFailMsg(
        `${currPhase}-DB-MM`,
        currForm,
        `${localInputValues[i]} !== ${localDbValues[colName]} (${colName})`,
      );
    } else {
      console.log(
        `Matched DB values of ${colName}: ${localInputValues[i]} === ${localDbValues[colName]}`,
      );
    }
  }
}

export async function validateGridValues(inputValues, gridValues) {
  const localInputValues = [...inputValues];
  const localGridValues = [...gridValues];

  updateCurrFormAndPhase();
  if (localInputValues.length !== localGridValues.length) {
    throwTestFailMsg(
      `${currPhase}-GRID-DI`,
      currForm,
      `${localInputValues.length} !== ${localGridValues.length}`,
    );
  }

  console.log(`\nGrid Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < localGridValues.length; i++) {
    let expected = String(localInputValues[i]).trim();
    let actual = String(localGridValues[i]).trim();

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

export async function validateTreeViewUiValues(treeViewValues, treeViewUiVals) {

  let expectedTreeViewValues = treeViewValues;

  const expectedTreeViewArray = [...expectedTreeViewValues].sort();
  const actualTreeViewArray = [...treeViewUiVals].sort();

  console.log(`\nTree View Values of ${currForm}:\n` + "-".repeat(85));

  const isLengthMatch = expectedTreeViewArray.length === actualTreeViewArray.length
  updateCurrFormAndPhase();

  if(!isLengthMatch){
    throwTestFailMsg(
      `${currPhase}-TREE-DI`,
      currForm,
      `Missing or extra Tree View UI input`,
    );
  }

  const expectedLength = expectedTreeViewArray.length;

  for (let i = 0; i < expectedLength; i++) {
    if (expectedTreeViewArray[i] === actualTreeViewArray[i]) {
        console.log(`Matched Tree UI values: ${expectedTreeViewArray[i]} === ${actualTreeViewArray[i]}`);
    } else {
        throwTestFailMsg(
            `${currPhase}-UI-MM`,
            currForm,
            `${expectedTreeViewArray[i]} !== ${actualTreeViewArray[i]}`,
        );
    }
  }

}

export async function validateTreeViewDBValues(treeViewUiVals, treeViewDbValues){

  const filteredUiVals = treeViewUiVals.filter(item => item.includes('/'));
  const cleanedDbVals = treeViewDbValues.map(row => row.OUSelect);

  let sortedUi = [...filteredUiVals].sort();
  const sortedDb = [...cleanedDbVals].sort();

  console.log(`\nTree View DB Values of ${currForm}:\n` + "-".repeat(85));

  const isLengthMatch = sortedUi.length === sortedDb.length
  updateCurrFormAndPhase();

  if(!isLengthMatch){
    throwTestFailMsg(
      `${currPhase}-TREE-DI`,
      currForm,
      `Missing or extra Tree View DB input`,
    );
  }

  const expectedLength = sortedUi.length;

  for (let i = 0; i < expectedLength; i++) {
    if (sortedUi[i] === sortedDb[i]) {
      console.log(`Matched Tree DB values: ${sortedUi[i]} === ${sortedDb[i]}`);
    } else {
      throwTestFailMsg(
        `${currPhase}-DB-MM`,
        currForm,
        `${sortedUi[i]} !== ${sortedDb[i]}`,
      )
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
    else if (col.includes("select")) {
      await element.locator().click();
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

export async function inputTreeViewValues(page, treeViewPath, treeViewValues){
  const treeViewID = treeViewPath;
  let treeViewExcelInput = treeViewValues;

  for (const currentItem of treeViewExcelInput) {
    let target;

    if (currentItem.includes('/')) {
      // Handles items with a path (Parent / Child)
      let [parentNode, childNode] = currentItem.split('/').map(node => node.trim());
      target = page.locator(`${treeViewID} li`, { hasText: parentNode })
                .locator('li', { hasText: new RegExp(`^${childNode}$`) });
    } else {
      // Handles single-level items
      target = page.locator(`${treeViewID} .k-in`, { hasText: currentItem })
                .locator('xpath=ancestor::li[1]');
    }

    await target.locator('input[type="checkbox"], .k-checkbox').first().click();
  }

}

export async function getTreeViewUiValues(page, treeViewPath){
  const treeViewID = treeViewPath;

  const checkedPaths = await page.locator(`${treeViewID} input[type="checkbox"]:checked`).evaluateAll((checkboxes, treeViewId) => {
    const treeRoot = document.querySelector(treeViewId);

    return checkboxes.map(cb => {
      const li = cb.closest('li');
      if (!li) return '';

      const pathParts = [];
      let currentLi = li;

      // Traverse up the DOM to find all ancestor li elements within the tree
      while (currentLi && treeRoot.contains(currentLi)) {
        // Find the direct text element (.k-in) for the current node
        const textElement = currentLi.querySelector(':scope > div > .k-in, :scope > .k-in');
        if (textElement) {
          pathParts.unshift(textElement.textContent.trim());
        }
        // Move up to the next parent li element
        currentLi = currentLi.parentElement.closest('li');
      }

      return pathParts.join('/');
    }).filter(Boolean);
  }, treeViewID);

  return checkedPaths;
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
