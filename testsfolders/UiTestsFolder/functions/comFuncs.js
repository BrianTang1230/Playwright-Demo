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
    paths.length !== columns.length ||
    columns.length !== createValues.length ||
    createValues.length !== editValues.length
  ) {
    console.error(
      paths,
      paths.length,
      columns,
      columns.length,
      createValues,
      createValues.length,
      editValues,
      editValues.length,
    );
    throwTestFailMsg(
      `${currPhase}-DATA-DI`,
      currForm,
      `Paths ${paths.length}, Columns ${columns.length}, Create Values ${createValues.length}, Edit Values ${editValues.length}`,
    );
  }
}

export async function SelectOU(page, inputPath, dropdownPath, ou) {
  const ouArrow = page.locator(inputPath).first();
  await page.waitForTimeout(10000);
  await ouArrow.click();

  const option = page.getByRole("option", { name: ou, exact: true });
  await page.waitForTimeout(2000);
  await option.click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function runStep(stepName, callback) {
  return await allure.step(stepName, async () => {
    return await callback();
  });
}

export async function getElementByPath(page, path) {
  let element;
  // If path starts with # or //, use .locator directly
  if (path.startsWith("#") || path.startsWith("//")) {
    element = page.locator(path).first();
  }

  // If path does not start with # or // and includes *, use .getByRole
  else if (path.includes("*")) {
    let role = path.split("*");

    // If role[1] is not a number lets find the element by name, else find by index
    if (role[1] || role[1].trim() !== "") {
      if (isNaN(Number(role[1]))) {
        element = page.getByRole(role[0], { name: role[1] }).first();
      } else element = page.getByRole(role[0]).nth(Number(role[1])).first();
    }
  } else {
    // If path does not start with any symbols, use .locator with name
    element = page.locator(`[name='${path}']`).first();
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

export function throwTestFailMsg(caseCode, formName, remarks = "") {
  let decodedCode = caseCode.split("-");
  let phase = "";
  let side = "";
  let reason = "";
  remarks = remarks === "" ? "" : ": " + remarks;

  if (decodedCode[0] === "C") {
    phase = "Creation";
  } else if (decodedCode[0] === "E1") {
    phase = "1st Edition";
  } else if (decodedCode[0] === "E2") {
    phase = "2nd Edition";
  } else if (decodedCode[0] === "D") {
    phase = "Deletion";
  } else if (decodedCode[0] === "B") {
    phase = "Before Tests";
  }

  if (decodedCode.includes("UI")) {
    side = "UI";
  } else if (decodedCode.includes("DB")) {
    side = "DATABASE";
  } else if (decodedCode.includes("GRID")) {
    side = "GRID";
  } else if (decodedCode.includes("DATA")) {
    side = "JSON or EXCEL";
  }

  if (decodedCode[2] === "MM") {
    reason = "Mismatch Value";
  } else if (decodedCode[2] === "NF") {
    reason = "Not Found";
  } else if (decodedCode[2] === "DI") {
    reason = "Data Issue/Missing Data";
  } else if (decodedCode[2] === "RF") {
    // For Deletion only
    reason = "Record Found";
  } else if (decodeCode[2] === "ERR") {
    reason = "Get Error";
  } else {
    reason = "Unknown Reason";
  }

  throw new Error(
    `${phase} in ${formName} failed due to ${reason} on ${side}${remarks}.\n${"-".repeat(85)}`,
  );
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

<<<<<<< Updated upstream
export function getUniversalDate(options = {}) {
  const { days = 0, dayPosition = null, format = 'DD/MM/YYYY' } = options;
  let date = new Date();
  date.setDate(date.getDate() + days);

  if (dayPosition === 'first') date.setDate(1);
  else if (dayPosition === 'last') date = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return format.replace('DD', dd).replace('MM', mm).replace('YYYY', yyyy);
}

export function buildGridRows(gridValues, cellsIndex) {
  if (!gridValues || !cellsIndex || cellsIndex.length === 0) return [];
    
  const colsPerRow = cellsIndex[0].length;
  const flatString = Array.isArray(gridValues) ? gridValues.join(";") : gridValues;
  const cleanString = flatString.replace(/\|/g, ";"); 
    
  const allVals = cleanString.split(";").map(v => {
    let trimmedVal = v.trim();
    if (trimmedVal === '[TODAY]') return getUniversalDate();
    if (trimmedVal === '[TODAY+1]') return getUniversalDate({ days: 1 });
    if (trimmedVal === '[TODAY+30]') return getUniversalDate({ days: 30 });
    if (trimmedVal === '[END_OF_MONTH]') return getUniversalDate({ dayPosition: 'last' });
    return trimmedVal;
  });

const gridRows = [];
for (let i = 0; i < allVals.length; i += colsPerRow) {
  gridRows.push(allVals.slice(i, i + colsPerRow).join(";"));
}
return gridRows;
}
=======
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
>>>>>>> Stashed changes
