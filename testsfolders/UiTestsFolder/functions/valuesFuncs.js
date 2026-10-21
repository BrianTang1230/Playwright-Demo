import {
  getElementByPath,
  throwTestFailMsg,
  getCurrForm,
  getCurrPhase,
} from "./comFuncs";
import Data from "@utils/data/uidata/loginData.json";

const region = process.env.REGION || Data.Region;
let currForm = "";
let currPhase = "";

function updateCurrFormAndPhase() {
  currForm = getCurrForm();
  currPhase = getCurrPhase();
}

function raiseUiFailure(error, details) {
  updateCurrFormAndPhase();
  throwTestFailMsg(
    `${currPhase || "B"}-UI-ERR`,
    currForm || "Unknown form",
    `${details}; ${error?.message || String(error)}`,
    error,
  );
}

export async function validateFormValues(inputValues, columns, uiValues) {
  updateCurrFormAndPhase();

  const localInputValues = [...inputValues];
  const localUiValues = [...uiValues];

  console.log(`\nUI Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < localInputValues.length; i++) {
    if (
      String(localInputValues[i]).trim() === "NA" ||
      String(localInputValues[i]).trim() === "AF" ||
      String(localUiValues[i]).trim() === "NA"
    )
      continue;

    if (columns[i].includes("numeric")) {
      console.log(columns[i], localInputValues[i], localUiValues[i]);
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
  updateCurrFormAndPhase();
  if (
    !Array.isArray(inputValues) ||
    !Array.isArray(inputCols) ||
    inputCols.some((column) => typeof column !== "string") ||
    !dbValues ||
    typeof dbValues !== "object" ||
    inputValues.length !== inputCols.length
  ) {
    throwTestFailMsg(
      `${currPhase || "B"}-DB-DI`,
      currForm || "Unknown form",
      "Input values, database columns, and database result are missing or mismatched",
    );
  }

  const localInputValues = [...inputValues];
  const localDbValues = dbValues;

  console.log(`\nDB Values of ${currForm}:\n` + "-".repeat(85));

  for (let i = 0; i < inputCols.length; i++) {
    // Columns split by space and get the first element be colName
    const colName = inputCols[i].split(" ")[0];
    if (!colName || !Object.prototype.hasOwnProperty.call(dbValues, colName)) {
      throwTestFailMsg(
        `${currPhase}-DB-DI`,
        currForm,
        `Database result is missing column ${colName || "<empty>"}`,
      );
    }

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
  updateCurrFormAndPhase();
  if (!Array.isArray(inputValues) || !Array.isArray(gridValues)) {
    throwTestFailMsg(
      `${currPhase || "B"}-GRID-DI`,
      currForm || "Unknown form",
      "Expected and actual grid values must be arrays",
    );
  }

  const localInputValues = [...inputValues];
  const localGridValues = [...gridValues];

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
  updateCurrFormAndPhase();
  if (!Array.isArray(treeViewValues) || !Array.isArray(treeViewUiVals)) {
    throwTestFailMsg(
      `${currPhase || "B"}-TREE-DI`,
      currForm || "Unknown form",
      "Expected and actual tree values must be arrays",
    );
  }

  const expectedTreeViewValues = treeViewValues;

  const expectedTreeViewArray = [...expectedTreeViewValues].sort();
  const actualTreeViewArray = [...treeViewUiVals].sort();

  console.log(`\nTree View Values of ${currForm}:\n` + "-".repeat(85));

  const isLengthMatch =
    expectedTreeViewArray.length === actualTreeViewArray.length;

  if (!isLengthMatch) {
    throwTestFailMsg(
      `${currPhase}-TREE-DI`,
      currForm,
      `Missing or extra Tree View UI input`,
    );
  }

  const expectedLength = expectedTreeViewArray.length;

  for (let i = 0; i < expectedLength; i++) {
    if (expectedTreeViewArray[i] === actualTreeViewArray[i]) {
      console.log(
        `Matched Tree UI values: ${expectedTreeViewArray[i]} === ${actualTreeViewArray[i]}`,
      );
    } else {
      throwTestFailMsg(
        `${currPhase}-UI-MM`,
        currForm,
        `${expectedTreeViewArray[i]} !== ${actualTreeViewArray[i]}`,
      );
    }
  }
}

export async function validateTreeViewDBValues(
  treeViewUiVals,
  treeViewDbValues,
) {
  updateCurrFormAndPhase();
  if (
    !Array.isArray(treeViewUiVals) ||
    !Array.isArray(treeViewDbValues) ||
    treeViewUiVals.some((item) => typeof item !== "string") ||
    treeViewDbValues.some((row) => !row || typeof row !== "object")
  ) {
    throwTestFailMsg(
      `${currPhase || "B"}-TREE-DI`,
      currForm || "Unknown form",
      "UI tree values or database tree rows are missing or invalid",
    );
  }

  const filteredUiVals = treeViewUiVals.filter((item) => item.includes("/"));
  const cleanedDbVals = treeViewDbValues.map((row) => row.OUSelect);

  let sortedUi = [...filteredUiVals].sort();
  const sortedDb = [...cleanedDbVals].sort();

  console.log(`\nTree View DB Values of ${currForm}:\n` + "-".repeat(85));

  const isLengthMatch = sortedUi.length === sortedDb.length;

  if (!isLengthMatch) {
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
  if (String(value).trim() === "NA" || String(value).trim() === "AF") {
    return;
  }

  col = String(col || "").toLowerCase();
  try {
    const element = await getElementByPath(page, path);
    await element.focus();

    // Check the hidden variant first because its name also contains "k-drop".
    if (col.includes("k-hidden-drop")) {
      const dropdownWrapper = element.locator("..");
      await dropdownWrapper.click({ force: true });
      await page
        .locator(`${path}_listbox li`, { hasText: String(value) })
        .first()
        .click();
    } else if (col.includes("k-drop")) {
      await element.click();
      await page
        .locator(`${path}_listbox li`, { hasText: String(value) })
        .first()
        .click();
    } else if (col.includes("checkbox")) {
      const normalizedValue = String(value).toLowerCase();
      if (normalizedValue === "true") {
        await element.check();
      } else if (normalizedValue === "false") {
        await element.uncheck();
      } else {
        throw new TypeError(
          `Expected true or false for checkbox field ${path}.`,
        );
      }
    } else if (col.includes("text") || col.includes("date")) {
      await element.fill(String(value));
      await element.press("Enter");
    } else if (col.includes("numeric")) {
      await element.press("Backspace");
      await element.type(String(value));
    } else if (col.includes("dropdown")) {
      await element.fill("");
      await element.type(String(value));
      await element.press("Enter");
    } else if (col.includes("combobox")) {
      await element.click();
      await page
        .locator('ul[role="listbox"] li', { hasText: String(value) })
        .first()
        .click();
    } else {
      throw new TypeError(`Unsupported field type "${col}" for ${path}.`);
    }

    await page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
  } catch (error) {
    raiseUiFailure(error, `Input field type ${col || "unknown"} at ${path}`);
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
  let targetRow = nRow;
  let currentColumn = null;
  try {
    if (!page || typeof path !== "string" || !Array.isArray(cellsIndex)) {
      throw new TypeError(
        "Page, grid selector, and cell indexes are required.",
      );
    }
    if (typeof values !== "string") {
      throw new TypeError(
        "Grid input data must be a semicolon-delimited string.",
      );
    }

    const table = page.locator(path);
    const vals = values.split(";");
    if (vals.length < cellsIndex.length) {
      throw new RangeError(
        `Grid data has ${vals.length} values for ${cellsIndex.length} target cells.`,
      );
    }

    if (options.hasAutoFill === true) targetRow = nRow + 1;
    const row = path.includes("tr[")
      ? table
      : table.locator("tr").nth(targetRow);

    for (let i = 0; i < cellsIndex.length; i++) {
      currentColumn = cellsIndex[i];
      if (vals[i] === "NA" || vals[i] === "AF") continue;

      const cell = row.locator("td").nth(currentColumn);
      await cell.click();

      const input = cell.locator("input").first();
      const normalizedValue = vals[i].toLowerCase();
      if (normalizedValue === "true") {
        await input.check();
        continue;
      } else if (normalizedValue === "false") {
        await input.uncheck();
        continue;
      }

      if (["RW", "PR", "NW", "HA"].includes(vals[i])) {
        await input.fill("");
      }

      await input.press("Control+A");
      await input.press("Control+A");
      await input.press("Backspace");
      await input.type(vals[i]);
      await input.press("Enter");
    }
  } catch (error) {
    raiseUiFailure(
      error,
      `Input grid ${path} at row ${targetRow + 1}, column ${currentColumn === null ? "unknown" : currentColumn + 1}`,
    );
  }
}

export async function inputTreeViewValues(page, treeViewPath, treeViewValues) {
  let currentItem = "unknown";
  try {
    if (
      !page ||
      typeof treeViewPath !== "string" ||
      !Array.isArray(treeViewValues)
    ) {
      throw new TypeError("Page, tree selector, and tree values are required.");
    }
    const treeViewID = treeViewPath;
    let treeViewExcelInput = treeViewValues;

    for (currentItem of treeViewExcelInput) {
      let target;

      if (currentItem.includes("/")) {
        // Handles items with a path (Parent / Child)
        let [parentNode, childNode] = currentItem
          .split("/")
          .map((node) => node.trim());
        target = page
          .locator(`${treeViewID} li`, { hasText: parentNode })
          .locator("li", { hasText: new RegExp(`^${childNode}$`) });
      } else {
        // Handles single-level items
        target = page
          .locator(`${treeViewID} .k-in`, { hasText: currentItem })
          .locator("xpath=ancestor::li[1]");
      }

      await target
        .locator('input[type="checkbox"], .k-checkbox')
        .first()
        .click();
    }
  } catch (error) {
    raiseUiFailure(
      error,
      `Select tree value "${currentItem}" in ${treeViewPath}`,
    );
  }
}

export async function getTreeViewUiValues(page, treeViewPath) {
  try {
    if (!page || typeof treeViewPath !== "string" || !treeViewPath) {
      throw new TypeError("Page and tree selector are required.");
    }
    const treeViewID = treeViewPath;

    const checkedPaths = await page
      .locator(`${treeViewID} input[type="checkbox"]:checked`)
      .evaluateAll((checkboxes, treeViewId) => {
        const treeRoot = document.querySelector(treeViewId);

        return checkboxes
          .map((cb) => {
            const li = cb.closest("li");
            if (!li) return "";

            const pathParts = [];
            let currentLi = li;

            // Traverse up the DOM to find all ancestor li elements within the tree
            while (currentLi && treeRoot.contains(currentLi)) {
              // Find the direct text element (.k-in) for the current node
              const textElement = currentLi.querySelector(
                ":scope > div > .k-in, :scope > .k-in",
              );
              if (textElement) {
                pathParts.unshift(textElement.textContent.trim());
              }
              // Move up to the next parent li element
              currentLi = currentLi.parentElement.closest("li");
            }

            return pathParts.join("/");
          })
          .filter(Boolean);
      }, treeViewID);

    return checkedPaths;
  } catch (error) {
    raiseUiFailure(error, `Read checked tree values from ${treeViewPath}`);
  }
}

// Get values from UI based on the paths provided
export async function getFormValues(page, paths) {
  const uiValues = [];
  if (!page || !Array.isArray(paths)) {
    raiseUiFailure(
      new TypeError("Page and an array of field selectors are required."),
      "Read form values",
    );
  }

  for (let i = 0; i < paths.length; i++) {
    try {
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
    } catch (error) {
      raiseUiFailure(error, `Read form field at ${paths[i]}`);
    }
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
  let currentGridPath = "unknown";
  let currentCellIndex = null;
  let currentRowIndex = null;
  try {
    if (!page || !Array.isArray(gridPaths) || !Array.isArray(cellsIndex)) {
      throw new TypeError(
        "Page, grid selectors, and cell indexes are required.",
      );
    }
    if (cellsIndex.length < gridPaths.length) {
      throw new RangeError(
        "A cell-index list is missing for one or more grids.",
      );
    }

    for (let i = 0; i < gridPaths.length; i++) {
      currentGridPath = gridPaths[i];
      currentRowIndex = null;
      const table = page.locator(gridPaths[i]);

      // 1. THE CONFIG FIX: Offset the row dynamically based on your options object!
      let row;
      if (gridPaths[i].includes("tr[")) {
        row = table;
        currentRowIndex = "explicit";
      } else if (options.isOneRow) {
        row = table.locator("tr").first();
        currentRowIndex = 1;
      } else {
        // If hasAutoFill is true, shift down by 1 (i + 1) to skip the auto-generated row.
        // If false, use 'i' to grab the normal rows in sequence
        const targetRow = options.hasAutoFill ? i + 1 : i;
        row = table.locator("tr").nth(targetRow);
        currentRowIndex = targetRow + 1;
      }

      const currentCellsIndex = cellsIndex[i];

      for (let j = 0; j < currentCellsIndex.length; j++) {
        currentCellIndex = currentCellsIndex[j];
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
  } catch (error) {
    raiseUiFailure(
      error,
      `Read grid ${currentGridPath} at row ${currentRowIndex ?? "unknown"}, column ${currentCellIndex === null ? "unknown" : currentCellIndex + 1}`,
    );
  }
}
