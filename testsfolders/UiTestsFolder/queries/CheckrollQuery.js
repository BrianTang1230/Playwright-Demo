function checkrollSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Worker Ad hoc Allowance":
      sqlCommand = `
        SELECT FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy') AS AllowMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_PCHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.AdHocNum = @DocNo AND A.OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;

    case "Worker Ad hoc Deduction":
      sqlCommand = `
        SELECT FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy') AS DeductMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_PCHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.AdHocNum = @DocNo AND A.OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;

    case "Worker Ad hoc Reimbursement":
      sqlCommand = `
        SELECT FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy') AS ReimburseMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_PCHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.AdHocNum = @DocNo AND A.OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;
  }

  return sqlCommand;
}

function checkrollGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Worker Ad hoc Allowance":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        D.PayCode + ' - ' + D.PayDesc AS AllowanceCode,
        E.AccNum + ' - ' + E.AccDesc AS Acccount,
        F.CCIDCode + ' - ' + F.CCIDDesc AS CCID,
        B.Qty AS Quantity,
        B.Rate AS CRRate,
        B.REMARKS AS Remarks
        FROM CR_PCDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN GMS_PayCodeStp D ON B.PayCodeKey = D.PayKey
        LEFT JOIN GMS_AccMas E ON B.PayAccKey = E.AccKey
        LEFT JOIN V_SYC_CCIDMapping F On B.CCIDKey = F.CCIDKey 
        WHERE PCHdrKey IN (
          SELECT PCHdrKey FROM CR_PCHdr G
          WHERE AdHocNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Worker Ad hoc Deduction":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        D.PayCode + ' - ' + D.PayDesc AS DeductionCode,
        E.AccNum + ' - ' + E.AccDesc AS Acccount,
        F.CCIDCode + ' - ' + F.CCIDDesc AS CCID,
        B.Qty AS Quantity,
        B.Rate AS CRRate,
        B.REMARKS AS Remarks
        FROM CR_PCDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN GMS_PayCodeStp D ON B.PayCodeKey = D.PayKey
        LEFT JOIN GMS_AccMas E ON B.PayAccKey = E.AccKey
        LEFT JOIN V_SYC_CCIDMapping F On B.CCIDKey = F.CCIDKey 
        WHERE PCHdrKey IN (
          SELECT PCHdrKey FROM CR_PCHdr G
          WHERE AdHocNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Worker Ad hoc Reimbursement":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        D.PayCode + ' - ' + D.PayDesc AS ReimbursementCode,
        E.AccNum + ' - ' + E.AccDesc AS Acccount,
        F.CCIDCode + ' - ' + F.CCIDDesc AS CCID,
        B.Qty AS Quantity,
        B.Rate AS CRRate,
        B.REMARKS AS Remarks
        FROM CR_PCDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN GMS_PayCodeStp D ON B.PayCodeKey = D.PayKey
        LEFT JOIN GMS_AccMas E ON B.PayAccKey = E.AccKey
        LEFT JOIN V_SYC_CCIDMapping F On B.CCIDKey = F.CCIDKey 
        WHERE PCHdrKey IN (
          SELECT PCHdrKey FROM CR_PCHdr G
          WHERE AdHocNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;
  }

  return sqlCommand;
}

module.exports = { checkrollSQLCommand, checkrollGridSQLCommand };
