function cmSQLCommand(formName) {
  let sqlCommand = `
    DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
      THEN 'SPSE - SURYA PALMA SEJAHTERA ESTATE'
      ELSE 'BNG - BINUANG ESTATE'
    END;
    DECLARE @OU2 VARCHAR(100) =
    CASE WHEN @region = 'IND'
      THEN 'SPSH - PT. SURYA PALMA SEJAHTERA'
      ELSE 'BWHO - HEAD OFFICE'
    END;
    `;

  switch (formName) {
    case "Job Order":
      sqlCommand += `
      SELECT FORMAT(A.JODate,'dd/MM/yyyy') AS JODate,
      B.ContactCode + ' - ' + B.ContactDesc AS Contractor,
      CASE A.Status
        WHEN 'OP' THEN 'OPEN'
        WHEN 'CL' THEN 'CLOSE'
        WHEN 'SM' THEN 'SUBMITTED'
        ELSE 'NULL'
      END AS Status,
      A.Remarks,
      A.RefContrNo,
      G.Amt AS TotalAmt,
      D.EmpyID + ' - ' + D.EmpyName AS Conductor,
      A.RetentionPer,
      A.RetentionMth,
      E.AccNum + ' - ' + E.AccDesc AS Account,
      F.CCIDCode + ' - ' + F.CCIDDesc AS CCID,
      FORMAT(A.StartDate,'dd/MM/yyyy') AS StartDate,
      FORMAT(A.EndDate,'dd/MM/yyyy') AS EndDate,
      Z.OUCode + ' - ' + Z.OUDesc AS OU
      FROM CTR_JOHdr A
      LEFT JOIN GMS_ContactStp B ON B.ContactKey = A.ContactKey
      LEFT JOIN GMS_EmpyContractStp C ON C.EmpyContractKey = A.EmpyContractKey
      LEFT JOIN GMS_EmpyPerMas D ON D.EmpyKey = C.EmpyKey
      LEFT JOIN GMS_AccMas E ON E.AccKey = A.AccKey
      LEFT JOIN V_SYC_CCIDMapping F ON F.CCIDKey = A.CCIDKey
      LEFT JOIN CTR_JODet G ON G.JOHdrKey = A.JOHdrKey
      LEFT JOIN GMS_OUStp Z ON Z.OUKey = A.OUKey
      WHERE Z.OUCode + ' - ' + Z.OUDesc = @OU AND
      JONum = @DocNo`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function cmGridSQLCommand(formName) {
  let sqlCommand = `
    DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
      THEN 'SPSE - SURYA PALMA SEJAHTERA ESTATE'
      ELSE 'BNG - BINUANG ESTATE'
    END;
    DECLARE @OU2 VARCHAR(100) =
    CASE WHEN @region = 'IND'
      THEN 'SPSH - PT. SURYA PALMA SEJAHTERA'
      ELSE 'BWHO - HEAD OFFICE'
    END;
    `;

  switch (formName) {
    case "Job Order":
      sqlCommand += `
      SELECT 
      CASE A.WithCER
        WHEN '0' THEN 'FALSE'
        WHEN '1' THEN 'TRUE'
      END AS WithCER,
      B.JobCode + ' - ' + B.JobDesc AS Job,
      C.JobCatCode + ' - ' + C.JobCatDesc AS JobCat,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
      F.UOMCode + ' - ' + F.UOMDesc AS UOM,
      A.Rate,
      A.Qty,
      A.Amt,
      A.Remarks
      FROM CTR_JODet A
      LEFT JOIN GMS_JobStp B ON B.JobKey = A.JobKey
      LEFT JOIN GMS_JobCatStp C ON C.JobCatKey = B.JobCatKey
      LEFT JOIN GMS_AccMas D ON D.AccKey = A.AccKey
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = A.CCIDKey
      LEFT JOIN GMS_UOMStp F ON F.UOMKey = A.UOMKey
      WHERE JOHdrKey IN (
      SELECT A.JOHdrKey FROM CTR_JOHdr A
      LEFT JOIN GMS_OUStp Z ON A.OUKey = Z.OUKey
        WHERE Z.OUCode + ' - ' + Z.OUDesc = @OU AND
        JONum = @DocNo
      )`;
      break;

    case "Job Receipt":
      sqlCommand += `
      SELECT 
      CASE A.WithCER
        WHEN '0' THEN 'FALSE'
        WHEN '1' THEN 'TRUE'
      END AS WithCER,
      B.JobCode + ' - ' + B.JobDesc AS Job,
      C.JobCatCode + ' - ' + C.JobCatDesc AS JobCat,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
      F.UOMCode + ' - ' + F.UOMDesc AS UOM,
      A.Rate,
      A.Qty,
      A.Amt,
      A.Remarks
      FROM CTR_JODet A
      LEFT JOIN GMS_JobStp B ON B.JobKey = A.JobKey
      LEFT JOIN GMS_JobCatStp C ON C.JobCatKey = B.JobCatKey
      LEFT JOIN GMS_AccMas D ON D.AccKey = A.AccKey
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = A.CCIDKey
      LEFT JOIN GMS_UOMStp F ON F.UOMKey = A.UOMKey
      WHERE JOHdrKey IN (
      SELECT A.JOHdrKey FROM CTR_JOHdr A
      LEFT JOIN GMS_OUStp Z ON A.OUKey = Z.OUKey
        WHERE Z.OUCode + ' - ' + Z.OUDesc = @OU AND
        JONum = @DocNo
      )`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

export { cmSQLCommand, cmGridSQLCommand };
