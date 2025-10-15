function weighbridgeSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Daily Total Crop Receipt by Crop Supplier":
      sqlCommand = `
        SELECT FORMAT(DATEFROMPARTS(
          TRY_CAST(A.Yr AS int), 
          TRY_CAST(A.Mth AS int), 
          1
        ), 'MMMM yyyy') AS Month,
        CASE
            WHEN A.EstateType = 'O' THEN 'Internal Crop Supplier'
            WHEN A.EstateType = 'E' THEN 'External Crop Supplier'
        END AS EstateType,
        A.Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM FPS_DailyTotCropRcvBySuppHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE 
            A.Yr IS NOT NULL
            AND A.Mth IS NOT NULL
            AND TRY_CAST(A.Yr AS int) IS NOT NULL
            AND TRY_CAST(A.Mth AS int) BETWEEN 1 AND 12
            AND FORMAT(
                DATEFROMPARTS(
                    TRY_CAST(A.Yr AS int), 
                    TRY_CAST(A.Mth AS int), 
                    1
                ), 
                'MMMM yyyy'
            ) = @Date
            AND B.OUCode + ' - ' + B.OUDesc = @OU`;
      break;
  }

  return sqlCommand;
}

function weighbridgeGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Daily Total Crop Receipt by Crop Supplier":
      sqlCommand = `
        SELECT B.EstateCode + ' - ' + B.EstateDesc AS Estate,
        C.BlockCode + ' - ' + C.BlockDesc AS Block,
        A.RcvDay01 AS D1numeric,
        A.RcvDay02 AS D2numeric,
        A.RcvDay03 AS D3numeric,
        A.RcvDay04 AS D4numeric,
        A.RcvDay05 AS D5numeric
        FROM FPS_DailyTotCropRcvBySuppDet A
        LEFT JOIN GMS_EstateStp B ON A.EstateKey = B.EstateKey
        LEFT JOIN GMS_BlockStp C ON A.BlockKey = C.BlockKey
        WHERE A.DailyTotCropRcvBySuppHdrKey IN (
            SELECT DailyTotCropRcvBySuppHdrKey
            FROM FPS_DailyTotCropRcvBySuppHdr 
            WHERE 
                Yr IS NOT NULL
                AND Mth IS NOT NULL
                AND TRY_CAST(Yr AS int) IS NOT NULL
                AND TRY_CAST(Mth AS int) IS NOT NULL
                AND TRY_CAST(Mth AS int) BETWEEN 1 AND 12
                AND FORMAT(
                    DATEFROMPARTS(
                        TRY_CAST(Yr AS int), 
                        TRY_CAST(Mth AS int), 
                        1
                    ), 
                    'MMMM yyyy'
                ) = @Date
                AND OUKey IN (
                    SELECT OUKey
                    FROM GMS_OUStp
                    WHERE OUCode + ' - ' + OUDesc = @OU
                )
        )`;
      break;
  }

  return sqlCommand;
}

module.exports = { weighbridgeSQLCommand, weighbridgeGridSQLCommand };
