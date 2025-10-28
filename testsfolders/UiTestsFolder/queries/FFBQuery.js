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

    case "Daily Rate Per OER":
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
      FROM FPS_DailyRateHdr A
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

    case "Monthly Rate Per OER":
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
      A.MRatePerOER AS MRate,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_MonthlyRateHdr A
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

    case "Transport & Processing Charges":
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
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_TProHdr A
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
      AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Transport, Quality and Volume Subsidy":
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
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_TransSubHdr A
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
      AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "FFB Advance Payment":
      sqlCommand = `
      SELECT 
      FORMAT(A.AdvDate, 'dd/MM/yyyy') AS Advance,
      FORMAT(A.PayDate, 'dd/MM/yyyy') AS Payment,
      A.Remarks,
      FORMAT(B.FFBFromDate, 'dd/MM/yyyy') AS FromDate,
      FORMAT(B.FFBToDate, 'dd/MM/yyyy') AS ToDate,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_AdvPayHdr A
      LEFT JOIN FPS_AdvPayDet B ON A.AdvPayHdrKey = B.AdvPayHdrKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE A.AdvPayNo = @DocNo`;
      break;

    case "FFB Unit Cost Adjustment":
      sqlCommand = `
      SELECT 
      FORMAT(DATEFROMPARTS(
        TRY_CAST(A.Yr AS int),
        TRY_CAST(A.Mth AS int),
        1
      ),
      'MMMM yyyy') AS Month,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_FFBUPAdjHdr A
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE FORMAT(DATEFROMPARTS(
        TRY_CAST(A.Yr AS int),
        TRY_CAST(A.Mth AS int),
        1
      ),
      'MMMM yyyy') = @Date
      AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "FFB Unit Cost Adjustment (Block)":
      sqlCommand = `
      SELECT 
      FORMAT(DATEFROMPARTS(
        TRY_CAST(A.Yr AS int),
        TRY_CAST(A.Mth AS int),
        1
      ),
      'MMMM yyyy') AS Month,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_FFBUPAdjBlkHdr A
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE FORMAT(DATEFROMPARTS(
        TRY_CAST(A.Yr AS int),
        TRY_CAST(A.Mth AS int),
        1
      ),
      'MMMM yyyy') = @Date
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

    case "Daily Rate Per OER":
      sqlCommand = `
        SELECT 
        D.RatePerOER AS RPOERnumeric
        FROM FPS_DailyRateDet D
        WHERE D.RateHdrKey IN (
        SELECT A.RateHdrKey
        FROM FPS_DailyRateHdr A
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

    case "Transport & Processing Charges":
      sqlCommand = `
        SELECT
        E.EstateCode + ' - ' + E.EstateDesc AS Estate,
        D.CPOTrans AS CPOnumeric,
        D.PKTrans AS PKPnumeric,
        D.Process AS Pnumeric,
        D.DiffCPO AS DCPOnumeric,
        D.DiffPK AS DPKnumeric
        FROM FPS_TProDet D
        LEFT JOIN GMS_EstateStp E ON D.EstateKey = E.EstateKey
        WHERE E.EstateCode + ' - ' + E.EstateDesc = @Estate
        AND D.TProHdrKey IN (
        SELECT A.TProHdrKey
        FROM FPS_TProHdr A
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
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;

    case "Transport, Quality and Volume Subsidy":
      sqlCommand = `
        SELECT
        E.EstateCode + ' - ' + E.EstateDesc AS Estate,
        D.Normal AS Nnumeric,
        D.Quality AS Qnumeric,
        F.ToWt AS Wnumeric
        FROM FPS_TransSubDet D
        LEFT JOIN GMS_EstateStp E ON D.EstateKey = E.EstateKey
        LEFT JOIN FPS_VolumeSub F ON D.TransSubDetKey = F.TransSubDetKey
        WHERE E.EstateCode + ' - ' + E.EstateDesc = @Estate
        AND D.TransSubHdrKey IN (
        SELECT A.TransSubHdrKey
        FROM FPS_TransSubHdr A
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
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;

    case "FFB Advance Payment":
      sqlCommand = `
        SELECT
        F.ContactCode + ' - ' + F.ContactDesc AS Contact,
        A.UnitPrice AS UPnumeric,
        A.AdvPer AS Pnumeric,
        A.AdjAmt AS AAnumeric,
        CASE
          WHEN A.PaymentType = 'Q' THEN 'Cheque'
          WHEN A.PaymentType = 'C' THEN 'Cash'
          ELSE 'Bank'
        END AS PaymentType
        FROM FPS_AdvPayDet A
        LEFT JOIN GMS_ContactStp F ON A.ContactKey = F.ContactKey
        WHERE A.AdvPayHdrKey IN (
         SELECT AdvPayHdrKey
         FROM FPS_AdvPayHdr
         WHERE AdvPayNo = @DocNo
        )`;
      break;

    case "FFB Unit Cost Adjustment":
      sqlCommand = `
        SELECT
        E.EstateCode + ' - ' + E.EstateDesc AS Estate,
        A.FromDay AS FDnumeric,
        A.ToDay AS TDnumeric,
        A.AdjAmt AS AAnumeric
        FROM FPS_FFBUPAdjDet A
        LEFT JOIN GMS_EstateStp E ON A.EstateKey = E.EstateKey
        WHERE A.FFBUPAdjHdrKey IN (
          SELECT H.FFBUPAdjHdrKey
          FROM FPS_FFBUPAdjHdr H
          LEFT JOIN GMS_OUStp C ON H.OUKey = C.OUKey
          WHERE FORMAT(DATEFROMPARTS(
            TRY_CAST(H.Yr AS int),
            TRY_CAST(H.Mth AS int),
            1
          ),
          'MMMM yyyy') = @Date
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;

    case "FFB Unit Cost Adjustment (Block)":
      sqlCommand = `
        SELECT
        E.BlockCode + ' - ' + E.BlockDesc AS Block,
        A.FromDay AS FDnumeric,
        A.ToDay AS TDnumeric,
        A.AdjAmt AS AAnumeric
        FROM FPS_FFBUPAdjBlkDet A
        LEFT JOIN GMS_BlockStp E ON A.BlockKey = E.BlockKey
        WHERE A.FFBUPAdjHdrKey IN (
          SELECT H.FFBUPAdjHdrKey
          FROM FPS_FFBUPAdjBlkHdr H
          LEFT JOIN GMS_OUStp C ON H.OUKey = C.OUKey
          WHERE FORMAT(DATEFROMPARTS(
            TRY_CAST(H.Yr AS int),
            TRY_CAST(H.Mth AS int),
            1
          ),
          'MMMM yyyy') = @Date
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )`;
      break;
  }

  return sqlCommand;
}

module.exports = { ffbSQLCommand, ffbGridSQLCommand };
