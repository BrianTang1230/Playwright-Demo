import { allure, expect } from "allure-playwright";

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
  await page.waitForSelector(inputPath);
  await page.locator(inputPath).first().click();
  await page.locator(dropdownPath, { hasText: ou }).first().click();

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

export async function throwTestFailMsg(caseCode, formName, remarks = "") {
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
    `${phase} in ${formName} failed due to ${reason} on ${side}${remarks}.\n${"-".repeat(100)}`,
  );
}

export function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}
