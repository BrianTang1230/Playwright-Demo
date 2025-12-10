function vehicleSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Vehicle Running Distribution":
      sqlCommand = `
      SELECT IIF(@region = 'IND',
        FORMAT(A.RunDistDate, 'MMMM yyyy', 'id-ID'),
        FORMAT(A.RunDistDate, 'MMMM yyyy', 'en-US')
      ) AS RunDistDate,
      B.VehID + ' - ' + B.VehDesc AS VehicleId,
      A.Remarks,
      CASE
        WHEN A.Status = 'O' THEN 'OPEN'
        WHEN A.Status = 'C' THEN 'CLOSE'
        WHEN A.Status = 'S' THEN 'SUBMITTED'
        WHEN A.Status = 'A' THEN 'APPROVED'
      END AS Status,
      A.
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM VEH_RunDistHdr A
      LEFT JOIN GMS_VehStp B ON A.VehKey = B.VehKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE A.RunDistNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Inter-OU Vehicle Running Distribution (Loan To)":
      sqlCommand = `
      SELECT IIF(@region = 'IND',
        FORMAT(A.RunDistDate, 'MMMM yyyy', 'id-ID'),
        FORMAT(A.RunDistDate, 'MMMM yyyy', 'en-US')
      ) AS RunDistDate,
      B.VehID + ' - ' + B.VehDesc AS VehicleId,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU,
      D.OUCode + ' - ' + D.OUDesc AS ToOU
      FROM VEH_IntRunDistHdr A
      LEFT JOIN GMS_VehStp B ON A.VehKey = B.VehKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      LEFT JOIN GMS_OUStp D ON A.ToOUKey = D.OUKey
      WHERE A.IRunDistNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;
  }

  return sqlCommand;
}

function vehicleGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Vehicle Running Distribution":
      sqlCommand = `
      SELECT B.AccNum + ' - ' + B.AccDesc AS Account,
        CASE WHEN A.CCIDKey = -1 THEN 'NA'
        ELSE C.CCIDCode + ' - ' + C.CCIDDesc
      END AS CCID,
      A.Remarks,
      A.Day01 + A.Day02 + A.Day03 + A.Day04 + A.Day05 AS Totnumeric,
      A.Day01 AS D1numeric,
      A.Day02 AS D2numeric,
      A.Day03 AS D3numeric,
      A.Day04 AS D4numeric,
      A.Day05 AS D5numeric
      FROM VEH_PRunDistDet A
      LEFT JOIN GMS_AccMas B ON A.ActExpAccKey = B.AccKey
      LEFT JOIN V_SYC_CCIDMapping C ON A.CCIDKey = C.CCIDKey
      WHERE A.RunDistHdrKey IN (
        SELECT RunDistHdrKey
        FROM VEH_RunDistHdr 
        WHERE RunDistNum = @DocNo AND OUKey IN (
        SELECT OUKey
        FROM GMS_OUStp
        WHERE OUCode + ' - ' + OUDesc = @OU
        )
      )`;
      break;

    case "Inter-OU Vehicle Running Distribution (Loan To)":
      sqlCommand = `
      SELECT B.AccNum + ' - ' + B.AccDesc AS Account,
        CASE WHEN A.CCIDKey = -1 THEN 'NA'
        ELSE C.CCIDCode + ' - ' + C.CCIDDesc
      END AS CCID,
      A.Remarks,
      A.Day01 AS D1numeric,
      A.Day02 AS D2numeric,
      A.Day03 AS D3numeric,
      A.Day04 AS D4numeric,
      A.Day05 AS D5numeric
      FROM VEH_IntPRunDistDet A
      LEFT JOIN GMS_AccMas B ON A.ActExpAccKey = B.AccKey
      LEFT JOIN V_SYC_CCIDMapping C ON A.CCIDKey = C.CCIDKey
      WHERE A.IntRunDistHdrKey IN (
        SELECT IntRunDistHdrKey
        FROM VEH_IntRunDistHdr 
        WHERE IRunDistNum = @DocNo AND OUKey IN (
        SELECT OUKey
        FROM GMS_OUStp
        WHERE OUCode + ' - ' + OUDesc = @OU
  ))`;
      break;
  }

  return sqlCommand;
}

module.exports = { vehicleSQLCommand, vehicleGridSQLCommand };
