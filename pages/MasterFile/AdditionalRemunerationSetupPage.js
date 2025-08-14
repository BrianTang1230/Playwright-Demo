import {
  InputPath,
  GridPath,
  CreateData,
  CreateGridData,
  EditData,
  EditGridData,
} from "../../data/masterData.json";
import InputValues from "../../functions/InputValues";
import selectRecord from "../../functions/SelectRecord";

// Create Function
async function AddRemSetupCreate(page, sideMenu) {
  // Click 'New' button
  await sideMenu.btnNew.click();

  // Define elements and values for creation
  const paths = InputPath.AddRemSetupPath.split(",");
  const columns = InputPath.AddRemSetupColumn.split(",");
  const values = CreateData.AddRemSetupData.split(",");

  const gridPaths = GridPath.AddRemSetupGrid.split(",");
  const gridValues = CreateGridData.AddRemSetupGridData.split(",");

  if (paths.length == columns.length && columns.length == values.length) {
    for (let i = 0; i < paths.length; i++) {
      await InputValues(page, paths[i], values[i]);
    }
  }

//   if (gridPaths.length == gridValues.length) {
//     for (let i = 0; i < gridPaths.length; i++) {
//       await InputValues(page, gridPaths[i], "grid", gridValues[i]);
//     }
//   }
}
