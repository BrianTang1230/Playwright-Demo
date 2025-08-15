import { InputPath, CreateData, EditData } from "../../data/masterData.json";
import { InputValues } from "../../functions/InputValues";
import SelectRecord from "../../functions/SelectRecord";
import { ValidateValues } from "../../functions/ValidateValues";

// Default elements and values for creation
const paths = InputPath.CountrySetupPath.split(",");
const columns = InputPath.CountrySetupColumn.split(",");
let values = CreateData.CountrySetupData.split(",");

// Create Function
async function CountrySetupCreate(page, sideMenu) {
  // Click "New" button
  await sideMenu.btnNew.click();

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Check Ui Values
  await ValidateValues(page, values, paths).then((isMatch) => {
    if (!isMatch) {
      throw new Error("Validation failed after creating the record.");
    }
  });
}

// Edit Function
async function CountrySetupEdit(page, sideMenu) {
  // Search and select the created record
  await SelectRecord(page, sideMenu, values, "search");

  // Change values for editing
  values = EditData.CountrySetupData.split(",");

  // Input new data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Save edited data
  await sideMenu.btnSave.click();

  // Search and select edited record
  await SelectRecord(page, sideMenu, values, "search");

  // Check Ui Values
  await ValidateValues(page, values, paths).then((isMatch) => {
    if (!isMatch) {
      throw new Error("Validation failed after editing the record.");
    }
  });
}

// Delete Function
async function CountrySetupDelete(page, sideMenu) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, values, "search", true);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}

module.exports = { CountrySetupCreate, CountrySetupEdit, CountrySetupDelete };
