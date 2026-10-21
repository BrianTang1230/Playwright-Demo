import { allure, expect } from "allure-playwright";
import { region } from "@utils/commonFunctions/GlobalSetup";

let currForm = "";
let currPhase = "";

export function setCurrForm(formName) {
  currForm = formName;
}

export function getCurrForm(formName) {
  return currForm;
}

export function setCurrPhase(phaseName) {
  currPhase = phaseName;
}

export function getCurrPhase() {
  return currPhase;
}

export async function checkLength(paths, columns, createValues, editValues) {
  if (
    !Array.isArray(paths) ||
    !Array.isArray(columns) ||
    !Array.isArray(createValues) ||
    !Array.isArray(editValues)
  ) {
    throwTestFailMsg(
      `${currPhase || "B"}-DATA-DI`,
      currForm || "Unknown form",
      "Paths, columns, create values, and edit values must all be arrays",
    );
  }

  if (
    paths.length !== columns.length ||
    columns.length !== createValues.length ||
    createValues.length !== editValues.length
  ) {
    throwTestFailMsg(
      `${currPhase}-DATA-DI`,
      currForm,
      `Paths ${paths.length}, Columns ${columns.length}, Create Values ${createValues.length}, Edit Values ${editValues.length}`,
    );
  }
}

export async function SelectOU(page, inputPath, dropdownPath, ou) {
  try {
    if (!page || typeof inputPath !== "string" || !inputPath || !ou) {
      throw new TypeError("Page, OU selector, and OU value are required.");
    }

    const ouArrow = page.locator(inputPath).first();
    await page.waitForTimeout(10000);
    await ouArrow.click();

    const option = page.getByRole("option", { name: ou, exact: true });
    await page.waitForTimeout(2000);
    await option.click();

    await page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
  } catch (error) {
    throwTestFailMsg(
      `${currPhase || "B"}-UI-ERR`,
      currForm || "Unknown form",
      `Selecting OU at ${inputPath}; option selector ${dropdownPath}`,
      error,
    );
  }
}

export async function runStep(stepName, callback) {
  return await allure.step(stepName, async () => {
    try {
      return await callback();
    } catch (error) {
      if (error?.uiStep === stepName) throw error;

      const contextualError = new Error(
        `UI step "${stepName}" failed: ${error?.message || String(error)}`,
        { cause: error },
      );
      contextualError.uiStep = stepName;
      contextualError.formName = currForm || "Unknown form";
      contextualError.phase = currPhase || "Unknown phase";
      throw contextualError;
    }
  });
}

export async function getElementByPath(page, path) {
  let element;
  if (!page || typeof path !== "string" || path.trim() === "") {
    throwTestFailMsg(
      `${currPhase || "B"}-DATA-DI`,
      currForm || "Unknown form",
      "A valid page and non-empty element path are required",
    );
  }

  // If path starts with # or //, use .locator directly
  if (path.startsWith("#") || path.startsWith("//")) {
    element = page.locator(path).first();
  }

  // If path does not start with # or // and includes *, use .getByRole
  else if (path.includes("*")) {
    const roleParts = path.split("*");

    // A numeric suffix selects a role index; any other suffix is the accessible name.
    const role = roleParts[0].trim();
    const nameOrIndex = roleParts.slice(1).join("*").trim();
    if (!role) {
      throwTestFailMsg(
        `${currPhase || "B"}-DATA-DI`,
        currForm || "Unknown form",
        `Invalid role locator: ${path}`,
      );
    }

    if (!nameOrIndex) {
      element = page.getByRole(role).first();
    } else if (/^\d+$/.test(nameOrIndex)) {
      element = page.getByRole(role).nth(Number(nameOrIndex));
    } else {
      element = page.getByRole(role, { name: nameOrIndex }).first();
    }
  } else {
    // If path does not start with any symbols, use .locator with name
    element = page.locator(`[name=${JSON.stringify(path)}]`).first();
  }

  if (!element) {
    throwTestFailMsg(
      `${currPhase}-DATA-DI`,
      currForm,
      `Element not found for ${path}`,
    );
  }

  return element;
}

export function throwTestFailMsg(caseCode, formName, remarks = "", cause) {
  const decodedCode = String(caseCode || "B-UI-ERR").split("-");
  const phaseCode = decodedCode[0];
  const reasonCode = decodedCode.at(-1);
  const phaseNames = {
    C: "Creation",
    E1: "1st Edition",
    E2: "2nd Edition",
    D: "Deletion",
    B: "Before Tests",
  };
  const reasonNames = {
    MM: "Mismatch Value",
    NF: "Not Found",
    DI: "Data Issue/Missing Data",
    RF: "Record Found",
    ERR: "Action Error",
  };
  const side = decodedCode.includes("UI")
    ? "UI"
    : decodedCode.includes("DB")
      ? "DATABASE"
      : decodedCode.includes("GRID")
        ? "GRID"
        : decodedCode.includes("TREE")
          ? "TREE VIEW"
          : decodedCode.includes("DATA")
            ? "JSON or EXCEL"
            : "UNKNOWN";
  const phase = phaseNames[phaseCode] || phaseCode || "Unknown phase";
  const reason = reasonNames[reasonCode] || "Unknown reason";
  const detail = remarks ? `: ${remarks}` : "";
  const displayFormName = formName || "Unknown form";

  const failure = new Error(
    `${phase} in ${displayFormName} failed due to ${reason} on ${side}${detail}.\n${"-".repeat(85)}`,
    cause ? { cause } : undefined,
  );
  failure.failureCode = caseCode;
  failure.formName = displayFormName;
  failure.phase = phase;
  failure.side = side;
  failure.reason = reason;
  throw failure;
}

export function formatGridData(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

export function convertNumericMonth(month) {
  const monthMap = {
    january: "1",
    januari: "1",
    february: "2",
    februari: "2",
    march: "3",
    maret: "3",
    april: "4",
    may: "5",
    mei: "5",
    june: "6",
    juni: "6",
    july: "7",
    juli: "7",
    august: "8",
    agustus: "8",
    september: "9",
    october: "10",
    oktober: "10",
    november: "11",
    december: "12",
    desember: "12",
  };

  return monthMap[month.toLowerCase()];
}

export function getUniversalDate(options = {}) {
  const { days = 0, dayPosition = null, format = "DD/MM/YYYY" } = options;
  let date = new Date();
  date.setDate(date.getDate() + days);

  if (dayPosition === "first") date.setDate(1);
  else if (dayPosition === "last")
    date = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return format.replace("DD", dd).replace("MM", mm).replace("YYYY", yyyy);
}

export function buildGridRows(gridValues, cellsIndex) {
  if (!gridValues || !cellsIndex || cellsIndex.length === 0) return [];

  const colsPerRow = cellsIndex[0].length;
  const flatString = Array.isArray(gridValues)
    ? gridValues.join(";")
    : gridValues;
  const cleanString = flatString.replace(/\|/g, ";");

  const allVals = cleanString.split(";").map((v) => {
    let trimmedVal = v.trim();
    if (trimmedVal === "[TODAY]") return getUniversalDate();
    if (trimmedVal === "[TODAY+1]") return getUniversalDate({ days: 1 });
    if (trimmedVal === "[TODAY+30]") return getUniversalDate({ days: 30 });
    if (trimmedVal === "[END_OF_MONTH]")
      return getUniversalDate({ dayPosition: "last" });
    return trimmedVal;
  });

  const gridRows = [];
  for (let i = 0; i < allVals.length; i += colsPerRow) {
    gridRows.push(allVals.slice(i, i + colsPerRow).join(";"));
  }
  return gridRows;
}

export function convertTextMonth(date) {
  const month = Number(date.split("/")[1]); // 9

  const monthMap = {
    1: region === "MY" ? "January" : "Januari",
    2: region === "MY" ? "February" : "Februari",
    3: region === "MY" ? "March" : "Maret",
    4: region === "MY" ? "April" : "April",
    5: region === "MY" ? "May" : "Mei",
    6: region === "MY" ? "June" : "Juni",
    7: region === "MY" ? "July" : "Juli",
    8: region === "MY" ? "August" : "Agustus",
    9: region === "MY" ? "September" : "September",
    10: region === "MY" ? "October" : "Oktober",
    11: region === "MY" ? "November" : "November",
    12: region === "MY" ? "December" : "Desember",
  };

  return monthMap[String(month)];
}
