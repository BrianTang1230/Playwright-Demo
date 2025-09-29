function payrollSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Staff Additional Remuneration":
      sqlCommand = `
        SELECT FORMAT(A.AddRemDate, 'MMMM yyyy') AS StaffAddRemDate, 
        B.DeptCode + ' - ' + B.DeptDesc AS Department,
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_AddRemHdr A
        LEFT JOIN GMS_DeptStp B ON A.DeptKey = B.DeptKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE ADRNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function payrollGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Staff Additional Remuneration":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        D.AddRemCode + ' - ' + D.AddRemDesc AS AddRem,
        C.AddRemAmt numeric
        FROM PR_AddRemDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey AND B.OUKey IN (
          SELECT OUKey FROM GMS_OUStp WHERE OUCode + ' - ' + OUDesc = @OU
        )
        LEFT JOIN PR_AddRemDedDet C ON A.AddRemDetKey = C.AddRemDetKey
        LEFT JOIN GMS_AddRemStp D ON C.AddRemKey = D.AddRemKey
        WHERE AddRemHdrKey IN (
          SELECT AddRemHdrKey FROM PR_AddRemHdr
          WHERE ADRNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
	        )
        )`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { payrollSQLCommand, payrollGridSQLCommand };
