import { InputPath, CreateData, EditData } from "../../data/masterData.json";
import InputValues from "../../functions/InputValues";
import selectRecord from "../../functions/SelectRecord";

// Create Function
async function CountrySetupCreate(page, sideMenu) {
  // Click "New" button
  await sideMenu.btnNew.click();

  // Define elements and values for creation
  const paths = InputPath.CountrySetupPath.split(",");
  const columns = InputPath.CountrySetupColumn.split(",");
  const values = CreateData.CountrySetupData.split(",");

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Search and select created record
  await selectRecord(page, values, "search");

  // Verification
  await sideMenu.btnEdit.click();

  // Compare Input Values with Ui Values
}

// Edit Function
async function CountrySetupEdit(page, sideMenu) {
  // Search and select the created record
  const values = CreateData.CountrySetupData.split(",");
  await selectRecord(page, values, "search");
  await sideMenu.btnEdit.click();

  // Define elements and new values for editing
  const paths = InputPath.CountrySetupPath.split(",");
  const columns = InputPath.CountrySetupColumn.split(",");
  const newValues = EditData.CountrySetupData.split(",");

  // Input new data
  if (
    paths.length == columns.length &&
    columns.length == values.length &&
    values.length == newValues.length
  ) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], newValues[i]);
    }
  }

  // Save edited data
  await sideMenu.btnSave.click();

  // Search and select edited record
  await selectRecord(page, newValues, "search");

  // Verification
  await sideMenu.btnEdit.click();

  // Compare Input Values with Ui Values
}

// Delete Function
async function CountrySetupDelete(page, sideMenu) {
  // Search and select the last edited record
  const values = EditData.CountrySetupData.split(",");
  await selectRecord(page, values, "search", true);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}

module.exports = { CountrySetupCreate, CountrySetupEdit, CountrySetupDelete };
