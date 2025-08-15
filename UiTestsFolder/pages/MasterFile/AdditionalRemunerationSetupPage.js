import {
  InputPath,
  GridPath,
  CreateData,
  CreateGridData,
  EditData,
  EditGridData,
} from "../../data/masterData.json";
import { InputValues, InputGridValues } from "../../functions/InputValues";
import SelectRecord from "../../functions/SelectRecord";
import {
  ValidateValues,
  ValidateGridValues,
} from "../../functions/ValidateValues";

// Default elements and values for creation
const paths = InputPath.AddRemSetupPath.split(",");
const columns = InputPath.AddRemSetupColumn.split(",");
let values = CreateData.AddRemSetupData.split(",");

// Default grid elements and values for creation
const gridPaths = GridPath.AddRemSetupGrid.split(",");
let gridValues = CreateGridData.AddRemSetupGridData.split(";");
const cellsIndex = [1, 2, 3];

// Create Function
async function AddRemSetupCreate(page, sideMenu) {
  // Click 'New' button
  await sideMenu.btnNew.click();

  // Input data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Click to add new item
  await page.locator("#btnNewItem").click();

  // Input grid data
  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex);
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Check Ui Values
  await ValidateValues(page, values, paths).then((isMatch) => {
    if (!isMatch) {
      throw new Error("Ui validation failed after creating the record.");
    }
  });

  // Check Grid Values
  for (let i = 0; i < gridPaths.length; i++) {
    await ValidateGridValues(
      page,
      gridValues[i],
      gridPaths[i],
      cellsIndex
    ).then((isMatch) => {
      if (!isMatch) {
        throw new Error(
          `Grid validation failed after creating the record.[Table${i}]`
        );
      }
    });
  }
}

// Edit Function
async function AddRemSetupEdit(page, sideMenu) {
  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Change values for editing
  values = EditData.AddRemSetupData.split(",");

  // Input new data
  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], columns[i], values[i]);
    }
  } else {
    throw new Error("Paths, columns, and values do not match in length.");
  }

  // Change grid values for editing
  gridValues = EditGridData.AddRemSetupGridData.split(";");

  // Input new grid data
  for (let i = 0; i < gridPaths.length; i++) {
    await InputGridValues(page, gridPaths[i], gridValues[i], cellsIndex, true);
  }

  // Save created data
  await sideMenu.btnSave.click();

  // Search and select created record
  await SelectRecord(page, sideMenu, values, "search");

  // Check Ui Values
  await ValidateValues(page, values, paths).then((isMatch) => {
    if (!isMatch) {
      throw new Error("Ui validation failed after creating the record.");
    }
  });

  // Check Grid Values
  for (let i = 0; i < gridPaths.length; i++) {
    await ValidateGridValues(
      page,
      gridValues[i],
      gridPaths[i],
      cellsIndex
    ).then((isMatch) => {
      if (!isMatch) {
        throw new Error(
          `Grid validation failed after creating the record.[Table${i}]`
        );
      }
    });
  }
}

// Delete Function
async function AddRemSetupDelete(page, sideMenu) {
  // Search and select the edited record
  await SelectRecord(page, sideMenu, values, "search", true);

  // Delete record
  await sideMenu.btnDelete.click();
  await sideMenu.confirmDelete.click();
}

module.exports = {
  AddRemSetupCreate,
  AddRemSetupEdit,
  AddRemSetupDelete,
};
