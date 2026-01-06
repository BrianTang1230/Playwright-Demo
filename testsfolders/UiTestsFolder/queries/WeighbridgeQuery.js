function weighbridgeSQLCommand(formName) {
  let sqlCommand = `
  DECLARE @OU VARCHAR(100) = 
      CASE WHEN @region = 'IND'
        THEN 'LSPM - LIBO SAWIT PERKASA PALM OIL MILL'
        ELSE 'SPOM - SERAYA PALM OIL MILL'
    END;
  `;

  switch (formName) {
    case "Daily Total Crop Receipt by Crop Supplier":
      sqlCommand += `
        SELECT IIF(@region = 'IND',
        FORMAT(DATEFROMPARTS(
          TRY_CAST(A.Yr AS int), 
          TRY_CAST(A.Mth AS int), 
          1
        ), 'MMMM yyyy', 'id-ID'), 
        FORMAT(DATEFROMPARTS(
          TRY_CAST(A.Yr AS int), 
          TRY_CAST(A.Mth AS int), 
          1
        ), 'MMMM yyyy', 'en-US') 
        ) AS Month,
        CASE
          WHEN A.EstateType = 'O' THEN 'Internal Crop Supplier'
          WHEN A.EstateType = 'E' THEN 'External Crop Supplier'
        END AS EstateType,
        CASE A.Status
            WHEN 'O' THEN 'OPEN'
            WHEN 'C' THEN 'CLOSE'
            WHEN 'S' THEN 'SUBMITTED'
            WHEN 'A' THEN 'APPROVED'
        END AS Status,
        A.Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM FPS_DailyTotCropRcvBySuppHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE TRY_CAST(A.Yr AS int) IS NOT NULL
        AND TRY_CAST(A.Mth AS int) BETWEEN 1 AND 12
        AND IIF(@region = 'IND',
        FORMAT(DATEFROMPARTS(
          TRY_CAST(A.Yr AS int), 
          TRY_CAST(A.Mth AS int), 
          1
        ), 'MMMM yyyy', 'id-ID'), 
        FORMAT(DATEFROMPARTS(
          TRY_CAST(A.Yr AS int), 
          TRY_CAST(A.Mth AS int), 
          1
        ), 'MMMM yyyy', 'en-US') 
        ) = @Date
        AND B.OUCode + ' - ' + B.OUDesc = @OU`;
      break;
  }

  return sqlCommand;
}

function weighbridgeGridSQLCommand(formName) {
  let sqlCommand = `
  DECLARE @OU VARCHAR(100) = 
      CASE WHEN @region = 'IND'
        THEN 'LSPM - LIBO SAWIT PERKASA PALM OIL MILL'
        ELSE 'SPOM - SERAYA PALM OIL MILL'
    END;
  `;

  switch (formName) {
    case "Daily Total Crop Receipt by Crop Supplier":
      sqlCommand += `
        SELECT B.EstateCode + ' - ' + B.EstateDesc AS Estate,
        CASE E.EstateType
          WHEN 'O' THEN C.BlockCode + ' - ' + C.BlockDesc 
          WHEN 'E' THEN D.BlockCode + ' - ' + D.BlockDesc
        END AS Block,
        CASE E.EstateType
          WHEN 'O' THEN E.Yr - C.PlantedYr
          WHEN 'E' THEN E.Yr - D.PlantedYr
        END AS PalmAge,
		    C.Grade,
        A.RcvDay01 + A.RcvDay02 + A.RcvDay03 + A.RcvDay04 + A.RcvDay05 AS Totnumeric,
        A.RcvDay01 AS D1numeric,
        A.RcvDay02 AS D2numeric,
        A.RcvDay03 AS D3numeric,
        A.RcvDay04 AS D4numeric,
        A.RcvDay05 AS D5numeric
        FROM FPS_DailyTotCropRcvBySuppDet A
        LEFT JOIN GMS_EstateStp B ON A.EstateKey = B.EstateKey
        LEFT JOIN GMS_BlockStp C ON A.BlockKey = C.BlockKey
		    LEFT JOIN GMS_OutsideBlockStp D ON A.outsideBlockKey = D.OutsideBlockKey
        LEFT JOIN FPS_DailyTotCropRcvBySuppHdr E ON A.DailyTotCropRcvBySuppHdrKey = E.DailyTotCropRcvBySuppHdrKey
        LEFT JOIN GMS_OUStp F ON E.OUKey = F.OUKey
        WHERE TRY_CAST(E.Yr AS int) IS NOT NULL
          AND TRY_CAST(E.Mth AS int) BETWEEN 1 AND 12
          AND IIF(@region = 'IND',
          FORMAT(DATEFROMPARTS(
            TRY_CAST(E.Yr AS int), 
            TRY_CAST(E.Mth AS int), 
            1
          ), 'MMMM yyyy', 'id-ID'), 
          FORMAT(DATEFROMPARTS(
            TRY_CAST(E.Yr AS int), 
            TRY_CAST(E.Mth AS int), 
            1
          ), 'MMMM yyyy', 'en-US')
          ) = @Date
          AND F.OUCode + ' - ' + F.OUDesc = @OU`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { weighbridgeSQLCommand, weighbridgeGridSQLCommand };
