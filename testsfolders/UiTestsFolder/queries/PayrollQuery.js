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
        WHERE A.ADRNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Staff Monthly Tax Deduction":
      sqlCommand = `
        SELECT FORMAT(A.PCBDate, 'MMMM yyyy') AS PCBMonth, 
        B.DeptCode + ' - ' + B.DeptDesc AS Department,
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_PCBHdr A
        LEFT JOIN GMS_DeptStp B ON A.DeptKey = B.DeptKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE FORMAT(A.PCBDate, 'MMMM yyyy') = @Date
          AND B.DeptCode + ' - ' + B.DeptDesc = @Dept
          AND C.OUCode + ' - ' + C.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create','Automation Testing Edit')`;
      break;

    case "Staff Previous Employment Tax Deduction":
      sqlCommand = `
        SELECT FORMAT(A.PreEmpDate, 'MMMM yyyy') AS PreEmpMonth, 
        B.DeptCode + ' - ' + B.DeptDesc AS Department,
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_PreEmpHdr A
        LEFT JOIN GMS_DeptStp B ON A.DeptKey = B.DeptKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE FORMAT(A.PCBDate, 'MMMM yyyy') = @Date
          AND B.DeptCode + ' - ' + B.DeptDesc = @Dept
          AND C.OUCode + ' - ' + C.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create','Automation Testing Edit')`;
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
        C.AddRemAmt AS numeric
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

    case "Staff Monthly Tax Deduction":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee, 
        A.ZakatAmt AS Zakatnumric,
        A.LevyAmt AS Levynumric,
        A.VOLA AS VOLAnumric,
        MAX(CASE WHEN C.Type = 'B' THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS BIK,
        SUM(CASE WHEN C.Type = 'B' THEN C.DedAmt ELSE 0 END) AS BIKnumeric,
        MAX(CASE WHEN C.Type = 'A' THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS AD,
        SUM(CASE WHEN C.Type = 'A' THEN C.DedAmt ELSE 0 END) AS ADnumeric
        FROM PR_PCBDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_PCBDedDet C ON A.PCBDetKey = C.PCBDetKey
        LEFT JOIN SYT_TaxDed D ON C.TaxDedKey = D.TaxDedKey
        WHERE A.PCBHdrKey IN (
          SELECT PCBHdrKey 
          FROM PR_PCBHdr H
          LEFT JOIN GMS_DeptStp Dept ON H.DeptKey = Dept.DeptKey
          LEFT JOIN GMS_OUStp OU ON H.OUKey = OU.OUKey
          WHERE FORMAT(H.PCBDate, 'MMMM yyyy') = @Date
            AND Dept.DeptCode + ' - ' + Dept.DeptDesc = @Dept 
            AND OU.OUCode + ' - ' + OU.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create','Automation Testing Edit')
        )
        GROUP BY 
          B.EmpyID, EmpyName, 
          A.ZakatAmt, A.LevyAmt, A.VOLA;`;
      break;

    case "Staff Previous Employment Tax Deduction":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee,
        CASE
          WHEN A.IsNewJoiner = 1 THEN 'True'
          ELSE 'False'
        END AS IsNewJoiner,
        A.NormalRem,
        A.EPF,
        A.S
        A.ZakatAmt AS Zakatnumric,
        A.LevyAmt AS Levynumric,
        A.VOLA AS VOLAnumric,
        MAX(CASE WHEN C.Type = 'B' THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS BIK,
        SUM(CASE WHEN C.Type = 'B' THEN C.DedAmt ELSE 0 END) AS BIKnumeric,
        MAX(CASE WHEN C.Type = 'A' THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS AD,
        SUM(CASE WHEN C.Type = 'A' THEN C.DedAmt ELSE 0 END) AS ADnumeric
        FROM PR_PreEmpDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_PCBDedDet C ON A.PCBDetKey = C.PCBDetKey
        LEFT JOIN SYT_TaxDed D ON C.TaxDedKey = D.TaxDedKey
        WHERE A.PCBHdrKey IN (
          SELECT PCBHdrKey 
          FROM PR_PCBHdr H
          LEFT JOIN GMS_DeptStp Dept ON H.DeptKey = Dept.DeptKey
          LEFT JOIN GMS_OUStp OU ON H.OUKey = OU.OUKey
          WHERE FORMAT(H.PCBDate, 'MMMM yyyy') = @Date
            AND Dept.DeptCode + ' - ' + Dept.DeptDesc = @Dept 
            AND OU.OUCode + ' - ' + OU.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create','Automation Testing Edit')
        )
        GROUP BY 
          B.EmpyID, EmpyName, 
          A.ZakatAmt, A.LevyAmt, A.VOLA;`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { payrollSQLCommand, payrollGridSQLCommand };
