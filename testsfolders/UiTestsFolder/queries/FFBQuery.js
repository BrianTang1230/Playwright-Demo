function ffbSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Monthly MPOB Price":
      sqlCommand = `
      SELECT A.Yr AS Year,
      B.RegionCode + ' - ' + B.RegionDesc AS Region,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_PriceHdr A
        LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.Yr = @Date
        AND B.RegionCode + ' - ' + B.RegionDesc = @Region
        AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Daily MPOB Price":
      sqlCommand = `
      SELECT A.Yr AS Year,
      B.RegionCode + ' - ' + B.RegionDesc AS Region,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_PriceHdr A
        LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE Yr = @Date
        AND B.RegionCode + ' - ' + B.RegionDesc = @Region
        AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;
  }

  return sqlCommand;
}

function ffbGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Monthly MPOB Price":
      sqlCommand = `
        SELECT CPOPrice AS CPOnumeric,
        PKPrice AS PKPnumeric,
        FFBPrice AS FPnumeric,
        RegionTax AS RTnumeric,
        MPOBCess AS MPnumeric,
        AddCess AS ACnumeric
        FROM FPS_PriceDet
        WHERE PriceHdrKey IN (
          SELECT PriceHdrKey
          FROM FPS_PriceHdr A
          LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
          LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
          WHERE Mth = '1'
          AND Yr = @Date
          AND B.RegionCode + ' - ' + B.RegionDesc = @Region
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;
  }

  return sqlCommand;
}

module.exports = { ffbSQLCommand, ffbGridSQLCommand };
