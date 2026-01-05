function ffbSQLCommand(formName) {
  let sqlCommand = `
  DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
      THEN 'LSPM - LIBO SAWIT PERKASA PALM OIL MILL'
      ELSE 'SPOM - SERAYA PALM OIL MILL'
  END;
  `;

  switch (formName) {
    case "Monthly MPOB Price":
      sqlCommand += `
        SELECT A.Yr AS Year,
        B.RegionCode + ' - ' + B.RegionDesc AS Region,
        A.Remarks,
        D.CurrCode + ' - ' + D.CurrDesc AS Currency,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
          WHEN 'S' THEN 'SUBMITTED'
          WHEN 'A' THEN 'APPROVED'
        END AS Status,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM FPS_PriceHdr A
        LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        LEFT JOIN GMS_CurrencyStp D ON D.CurrKey = A.CurrKey
        WHERE A.Yr = @Date
        AND B.RegionCode + ' - ' + B.RegionDesc = @Region
        AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Daily MPOB Price":
      sqlCommand += `
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
      D.CurrCode + ' - ' + D.CurrDesc AS Currency,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
        WHEN 'S' THEN 'SUBMITTED'
        WHEN 'A' THEN 'APPROVED'
      END AS Status,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_DailyPriceHdr A
      LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      LEFT JOIN GMS_CurrencyStp D ON D.CurrKey = A.CurrKey
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
      sqlCommand += `
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
      D.CurrCode + ' - ' + D.CurrDesc AS Currency,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
        WHEN 'S' THEN 'SUBMITTED'
        WHEN 'A' THEN 'APPROVED'
      END AS Status,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_DailyRateHdr A
      LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      LEFT JOIN GMS_CurrencyStp D ON D.CurrKey = A.CurrKey
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
      sqlCommand += `
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
      D.CurrCode + ' - ' + D.CurrDesc AS Currency,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
        WHEN 'S' THEN 'SUBMITTED'
        WHEN 'A' THEN 'APPROVED'
      END AS Status,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_MonthlyRateHdr A
      LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      LEFT JOIN GMS_CurrencyStp D ON D.CurrKey = A.CurrKey
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
      sqlCommand += `
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
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
        WHEN 'S' THEN 'SUBMITTED'
        WHEN 'A' THEN 'APPROVED'
      END AS Status,
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
      sqlCommand += `
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
	    CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
        WHEN 'S' THEN 'SUBMITTED'
        WHEN 'A' THEN 'APPROVED'
      END AS Status,
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
      sqlCommand += `
      SELECT 
      FORMAT(A.AdvDate, 'dd/MM/yyyy') AS Advance,
      FORMAT(A.PayDate, 'dd/MM/yyyy') AS Payment,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
      END AS Status,
      A.Remarks,
      FORMAT(B.FFBFromDate, 'dd/MM/yyyy') AS FromDate,
      FORMAT(B.FFBToDate, 'dd/MM/yyyy') AS ToDate,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_AdvPayHdr A
      LEFT JOIN FPS_AdvPayDet B ON A.AdvPayHdrKey = B.AdvPayHdrKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE A.AdvPayNo = @DocNo
      AND C.OUCode + ' - ' + C.OUDesc = @OU
      `;
      break;

    case "FFB Unit Cost Adjustment":
      sqlCommand += `
      SELECT 
      FORMAT(DATEFROMPARTS(
        TRY_CAST(A.Yr AS int),
        TRY_CAST(A.Mth AS int),
        1
      ),
      'MMMM yyyy') AS Month,
      A.Remarks,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
      END AS Status,
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
      sqlCommand += `
      SELECT 
      FORMAT(DATEFROMPARTS(
        TRY_CAST(A.Yr AS int),
        TRY_CAST(A.Mth AS int),
        1
      ),
      'MMMM yyyy') AS Month,
      A.Remarks,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
      END AS Status,
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

    case "Daily Rate by Palm Age":
      sqlCommand += `
      SELECT 
      FORMAT(A.FromDate,
      'dd/MM/yyyy') AS FromDate,
      FORMAT(A.ToDate,
      'dd/MM/yyyy') AS ToDate,
      E.RegionCode + ' - ' + E.RegionDesc AS Region,
      D.CurrCode + ' - ' + D.CurrDesc AS Currency,
      CASE A.Status
        WHEN 'O' THEN 'OPEN'
        WHEN 'C' THEN 'CLOSE'
      END AS Status,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM FPS_DailyRatePAgeHdr A
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      LEFT JOIN GMS_CurrencyStp D ON A.CurrKey = D.CurrKey
      LEFT JOIN GMS_RegionStp E ON A.RegionKey = E.RegionKey
      WHERE FORMAT(A.FromDate,
      'dd/MM/yyyy') = @Date
	    AND E.RegionCode + ' - ' + E.RegionDesc = @Area
      AND C.OUCode + ' - ' + C.OUDesc = @OU
      `;
      break;
  }

  return sqlCommand;
}

function ffbGridSQLCommand(formName) {
  let sqlCommand = `
  DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
      THEN 'LSPM - LIBO SAWIT PERKASA PALM OIL MILL'
      ELSE 'SPOM - SERAYA PALM OIL MILL'
  END;
  `;

  switch (formName) {
    case "Monthly MPOB Price":
      sqlCommand += `
        SELECT  DATENAME(MONTH, A.Mth) AS [Month],
        A.CPOPrice AS CPOnumeric,
        A.PKPrice AS PKPnumeric,
        A.FFBPrice AS FPnumeric,
        A.RegionTax AS RTnumeric,
        A.MPOBCess AS MPnumeric,
        A.AddCess AS ACnumeric,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
        END AS Status
        FROM FPS_PriceDet A
        WHERE PriceHdrKey IN (
          SELECT PriceHdrKey
          FROM FPS_PriceHdr A
          LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
          LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
          WHERE Yr = @Date
          AND B.RegionCode + ' - ' + B.RegionDesc = @Region
          AND C.OUCode + ' - ' + C.OUDesc = @OU
        )
        AND A.Mth = '1'`;
      break;

    case "Daily MPOB Price":
      sqlCommand += `
        SELECT D.Day AS [Day],
        D.CPOPrice AS CPOnumeric,
        D.PKPrice AS PKPnumeric,
        D.FFBPrice AS FPnumeric,
        D.RegionTax AS RTnumeric,
        D.MPOBCess AS MPnumeric,
        D.AddCess AS ACnumeric
        FROM FPS_DailyPriceDet D
        WHERE D.Day = '1' AND D.PriceHdrKey IN (
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
      sqlCommand += `
        SELECT D.Day AS [Day],
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
      sqlCommand += `
        SELECT
        E.EstateCode + ' - ' + E.EstateDesc AS Estate,
        F.ContactCode + ' - ' + F.ContactDesc AS Contact,
        D.CPOTrans AS CPOnumeric,
        D.PKTrans AS PKPnumeric,
        D.Process AS Pnumeric,
        D.DiffCPO AS DCPOnumeric,
        D.DiffPK AS DPKnumeric
        FROM FPS_TProDet D
        LEFT JOIN GMS_EstateStp E ON D.EstateKey = E.EstateKey
        LEFt JOIN GMS_ContactStp F ON D.SupplierKey = F.ContactKey
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
      sqlCommand += `
        SELECT
        E.EstateCode + ' - ' + E.EstateDesc AS Estate,
		    G.ContactCode + ' - ' + G.ContactDesc AS Contact,
        D.Normal AS Nnumeric,
        D.Quality AS Qnumeric,
		    F.Seq AS Snumeric,
		    F.FromWt AS FWnumeric,
        F.ToWt AS Wnumeric,
		    F.UnitPrice AS Pricenumeric
        FROM FPS_TransSubDet D
        LEFT JOIN GMS_EstateStp E ON D.EstateKey = E.EstateKey
        LEFT JOIN FPS_VolumeSub F ON D.TransSubDetKey = F.TransSubDetKey
        LEFT JOIN GMS_ContactStp G ON E.ContactKey = G.ContactKey
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
      sqlCommand += `
      SELECT F.ContactCode + ' - ' + F.ContactDesc AS Contact,
      FORMAT(A.FFBFromDate,'dd/MM/yyyy') AS FromDate,
      FORMAT(A.FFBToDate,'dd/MM/yyyy') AS ToDate,
		  A.TotalWt AS TWnumeric,
      A.UnitPrice AS UPnumeric,
		  A.TotalFFBPrice AS FFBPnumeric,
      A.AdvPer AS Pnumeric,
      A.AdjAmt AS AAnumeric,
		  A.NettAmt AS NAnumeric,
      CASE A.PaymentType
        WHEN 'Q' THEN 'Cheque'
        WHEN 'C' THEN 'Cash'
        ELSE 'Bank'
      END AS PaymentType,
      CASE A.BankKey 
        WHEN -1 THEN NULL
        ELSE E.BankCode + ' - ' + E.BankDesc
      END AS BankCode,
      CASE A.CashKey
        WHEN -1 THEN NULL
        ELSE D.CashCode + ' - ' + D.CashDesc
      END AS CashCode,
      A.ChequeNo,
      CASE A.BenKey
        WHEN -1 THEN '-'
        ELSE C.BNMCode + ' - ' + C.BeneficiaryName
      END AS Beneficiary
      FROM FPS_AdvPayDet A
      LEFT JOIN GMS_ContactStp F ON A.ContactKey = F.ContactKey
      LEFT JOIN GMS_BankStp E ON A.BankKey = E.BankKey
      LEFT JOIN GMS_CashStp D ON A.CashKey = D.CashKey
      LEFT JOIN GMS_BeneficiaryStp C ON A.BenKey = C.BenKey
      WHERE A.AdvPayHdrKey IN (
        SELECT AdvPayHdrKey
        FROM FPS_AdvPayHdr
        WHERE AdvPayNo = @DocNo
      )`;
      break;

    case "FFB Unit Cost Adjustment":
      sqlCommand += `
        SELECT
        E.EstateCode + ' - ' + E.EstateDesc AS Estate,
        F.ContactCode + ' - ' + F.ContactDesc AS Contact,
        A.FromDay AS FromDay,
        A.ToDay AS ToDay,
        A.AdjAmt AS AAnumeric
        FROM FPS_FFBUPAdjDet A
        LEFT JOIN GMS_EstateStp E ON A.EstateKey = E.EstateKey
        LEFT JOIN GMS_ContactStp F ON E.ContactKey = F.ContactKey
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
      sqlCommand += `
        SELECT
        E.BlockCode + ' - ' + E.BlockDesc AS Block,
        F.EstateCode + ' - ' + F.EstateDesc AS Estate,
        G.ContactCode + ' - ' + G.ContactDesc AS Contact,
        A.FromDay AS FromDay,
        A.ToDay AS ToDay,
        A.AdjAmt AS AAnumeric
        FROM FPS_FFBUPAdjBlkDet A
        LEFT JOIN GMS_BlockStp E ON A.BlockKey = E.BlockKey
        LEFT JOIN GMS_EstateStp F ON E.EstateKey = F.EstateKey
        LEFT JOIN GMS_ContactStp G ON F.ContactKey = G.ContactKey
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

    case "Daily Rate by Palm Age":
      sqlCommand += `
      SELECT 
      D.FromAge AS FAnumeric,
      D.ToAge AS TAnumeric,
      D.RatePerWt AS RPWnumeric
      FROM FPS_DailyRatePAgeDet D
      WHERE RatePAgeHdrKey IN (
        SELECT A.RatePAgeHdrKey
        FROM FPS_DailyRatePAgeHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        LEFT JOIN GMS_RegionStp E ON A.RegionKey = E.RegionKey
        WHERE FORMAT(A.FromDate,
        'dd/MM/yyyy') = @Date
        AND E.RegionCode + ' - ' + E.RegionDesc = @Area
        AND C.OUCode + ' - ' + C.OUDesc = @OU
      )`;
      break;
  }

  return sqlCommand;
}

module.exports = { ffbSQLCommand, ffbGridSQLCommand };
