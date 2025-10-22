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
      SELECT
      IIF(@region = 'IND',
        FORMAT(
          DATEFROMPARTS(
            TRY_CAST(A.Yr AS int),
            TRY_CAST(A.Mth AS int),
            1
          ),
          'MMMM yyyy',
          'id-ID'
        ),
        FORMAT(
          DATEFROMPARTS(
            TRY_CAST(A.Yr AS int),
            TRY_CAST(A.Mth AS int),
            1
          ),
          'MMMM yyyy',
          'en-US'
        )
      ) AS [Month],
      B.RegionCode + ' - ' + B.RegionDesc AS Region,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_DailyPriceHdr A
      LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE 
        TRY_CAST(A.Yr AS int) BETWEEN 1900 AND 2100
        AND TRY_CAST(A.Mth AS int) BETWEEN 1 AND 12
        AND IIF(@region = 'IND',
          FORMAT(
              DATEFROMPARTS(
                  TRY_CAST(A.Yr AS int),
                  TRY_CAST(A.Mth AS int),
                  1
              ),
              'MMMM yyyy',
              'id-ID'
          ),
          FORMAT(
              DATEFROMPARTS(
                  TRY_CAST(A.Yr AS int),
                  TRY_CAST(A.Mth AS int),
                  1
              ),
              'MMMM yyyy',
              'en-US'
          )
      ) = @Date
      AND B.RegionCode + ' - ' + B.RegionDesc = @Nation
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
          WHERE A.Mth = '1'
          AND Yr = @Date
          AND B.RegionCode + ' - ' + B.RegionDesc = @Region
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;

    case "Daily MPOB Price":
      sqlCommand = `
        SELECT 
        D.CPOPrice AS CPOnumeric,
        D.PKPrice AS PKPnumeric,
        D.FFBPrice AS FPnumeric,
        D.RegionTax AS RTnumeric,
        D.MPOBCess AS MPnumeric,
        D.AddCess AS ACnumeric
        FROM FPS_DailyPriceDet D
        WHERE D.PriceHdrKey IN (
        SELECT A.PriceHdrKey
        FROM FPS_DailyPriceHdr A
        LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE 
          TRY_CAST(A.Yr AS int) BETWEEN 1900 AND 2100
          AND TRY_CAST(A.Mth AS int) BETWEEN 1 AND 12
          AND IIF(@region = 'IND',
            FORMAT(
              DATEFROMPARTS(
                TRY_CAST(A.Yr AS int),
                TRY_CAST(A.Mth AS int),
                1
              ),
            'MMMM yyyy',
            'id-ID'
          ),
          FORMAT(
            DATEFROMPARTS(
              TRY_CAST(A.Yr AS int),
              TRY_CAST(A.Mth AS int),
              1
            ),
            'MMMM yyyy',
            'en-US'
            )
          ) = @Date
          AND B.RegionCode + ' - ' + B.RegionDesc = @Nation
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;
  }

  return sqlCommand;
}

module.exports = { ffbSQLCommand, ffbGridSQLCommand };
