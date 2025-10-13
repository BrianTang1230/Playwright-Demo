function checkrollSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Worker Ad hoc Allowance":
      sqlCommand = `
        SELECT FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy') AS Month,
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
        B.Qty AS Quantity,
        B.Rate AS CRRate,
        B.REMARKS AS Remarks
        FROM CR_PCDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN GMS_PayCodeStp D ON B.PayCodeKey = D.PayKey
        LEFT JOIN GMS_AccMas E ON B.PayAccKey = E.AccKey
        WHERE B.PCHdrKey IN (
            SELECT PCHdrKey 
            FROM CR_PCHdr G
            LEFT JOIN GMS_OUStp H ON G.OUKey = H.OUKey
            WHERE H.OUCode + ' - ' + H.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create','Automation Testing Edit')
        )`;
      break;
  }

  return sqlCommand;
}

module.exports = { checkrollSQLCommand, checkrollGridSQLCommand };
