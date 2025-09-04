function vehicleSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Vehicle Running Distribution":
      sqlCommand = "SELECT * FROM VehicleRunningDistribution WHERE ...";
      break;
  }

  return sqlCommand;
}

function vehicleGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Vehicle Running Distribution":
      sqlCommand = "SELECT * FROM VehicleRunningDistribution WHERE ...";
      break;
  }

  return sqlCommand;
}

module.exports = { vehicleSQLCommand, vehicleGridSQLCommand };
