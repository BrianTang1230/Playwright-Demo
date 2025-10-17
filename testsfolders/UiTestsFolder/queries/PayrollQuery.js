function payrollSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Staff Additional Remuneration":
      sqlCommand = `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.AddRemDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.AddRemDate, 'MMMM yyyy', 'en-US')
        ) AS StaffAddRemDate,
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
        WHERE FORMAT(A.PreEmpDate, 'MMMM yyyy') = @Date
          AND B.DeptCode + ' - ' + B.DeptDesc = @Dept
          AND C.OUCode + ' - ' + C.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create','Automation Testing Edit')`;
      break;

    case "Staff CP38":
      sqlCommand = `
        SELECT FORMAT(A.AddTaxDate, 'MMMM yyyy') AS AddTaxMonth, 
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_AddTaxHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.ADTNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Staff Income Declaration (EA Form)":
      sqlCommand = `
        SELECT A.Yr AS YearDeclared, 
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_PCBArrearsHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.Yr = @Date
          AND C.OUCode + ' - ' + C.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create','Automation Testing Edit')`;
      break;

    case "Staff Loan/Deposit Maintenance":
      sqlCommand = `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) AS OMMonth,
        B.RecTypeCode + ' - ' + B.RecTypeDesc AS RecType,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_OutsMaintHdr A
        LEFT JOIN GMS_RecTypeStp B ON A.RecTypeKey = B.RecTypeKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE   
        IIF(@region = 'IND',
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) = @Date
        AND C.OUCode + ' - ' + C.OUDesc = @OU
        AND B.RecTypeCode + ' - ' + B.RecTypeDesc = @RecType
        AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND');`;
      break;

    case "Staff Advance Payment":
      sqlCommand = `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.AdvPayDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.AdvPayDate, 'MMMM yyyy', 'en-US')
        ) AS ADVMonth,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_AdvPayHdr A 
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.AdvPayNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU;`;
      break;

    case "Staff Preceding Tax (PPh 21)":
      sqlCommand = `
        SELECT FORMAT(A.PrecedingDate, 'MMMM yyyy', 'id-ID') AS PrecedingMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM PR_PreTaxSubHdr_IND A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.PreTaxSubNum = @DocNo 
        AND A.OUKey IN (
          SELECT OUKey FROM GMS_OUStp
          WHERE OUCode + ' - ' + OUDesc = @OU
        )
        AND A.Remarks IN ('Automation Testing Create IND','Automation Testing Edit IND');`;
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
        A.NormalRem AS NorRemnumeric,
        A.EPF AS EPFnumeric,
        SUM(CASE WHEN C.Type = 'A' AND (D.TaxDedCode + ' - ' + D.TaxDedDesc) = 'SOCSO - SOCSO and EIS payment' THEN C.DedAmt ELSE 0 END) AS SOSOCnumeric,
        A.AddRem AS AddRemnumeric,
        CASE
          WHEN A.IsInclAddRemInPCBCalc = 1 THEN 'True'
          ELSE 'False'
        END AS InclAddRem,
        A.AddEPF AS AddEPFnumeric,
        A.VOLA AS VOLAnumeric,
        A.NormalAlw AS NorAllwnumeric,
        A.Allowance AS Allwnumeric,
        A.ChildAllw AS ChildAllwnumeric,
        A.FreeGoods AS FreeGoodsnumeric,
        A.Perquisite AS Perquisitenumeric,
        A.Others AS Othersnumeric,
        A.TotDeduct AS PCBDednumeric,
        A.TotZakat AS Zakatnumric,
        A.TotLevy AS Levynumric,
        A.CP38 AS CP38numric,
        MAX(CASE WHEN C.Type = 'B' THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS BIK,
        SUM(CASE WHEN C.Type = 'B' THEN C.DedAmt ELSE 0 END) AS BIKnumeric,
        MAX(CASE WHEN C.Type = 'A' AND (D.TaxDedCode + ' - ' + D.TaxDedDesc) != 'SOCSO - SOCSO and EIS payment' THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS AD,
        SUM(CASE WHEN C.Type = 'A' AND (D.TaxDedCode + ' - ' + D.TaxDedDesc) != 'SOCSO - SOCSO and EIS payment' THEN C.DedAmt ELSE 0 END) AS ADnumeric
        FROM PR_PreEmpDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_PreEmpDedDet C ON A.PreEmpDetKey = C.PreEmpDetKey
        LEFT JOIN SYT_TaxDed D ON C.TaxDedKey = D.TaxDedKey
        WHERE A.PreEmpHdrKey IN (
          SELECT PreEmpHdrKey 
          FROM PR_PreEmpHdr H
          LEFT JOIN GMS_DeptStp E ON H.DeptKey = E.DeptKey
          LEFT JOIN GMS_OUStp F ON H.OUKey = F.OUKey
          WHERE FORMAT(H.PreEmpDate, 'MMMM yyyy') = @Date
            AND E.DeptCode + ' - ' + E.DeptDesc = @Dept 
            AND F.OUCode + ' - ' + F.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create','Automation Testing Edit')
        )
        GROUP BY 
          B.EmpyID, EmpyName,
		      A.IsNewJoiner,NormalRem,EPF,AddRem,IsInclAddRemInPCBCalc,AddEPF,VOLA,NormalAlw,Allowance,ChildAllw,FreeGoods,Perquisite,Others,TotDeduct,TotZakat,TotLevy,CP38`;
      break;

    case "Staff CP38":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        A.AddTaxAmt AS TaxAmt
        FROM PR_AddTaxDet A
        INNER JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey AND B.OUKey IN (
          SELECT OUKey FROM GMS_OUStp WHERE OUCode + ' - ' + OUDesc = @OU
        )
        INNER JOIN PR_AddTaxHdr C ON A.AddTaxHdrKey = C.AddTaxHdrKey`;
      break;

    case "Staff Income Declaration (EA Form)":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee,
        C.IncType AS IncomeType,
        FORMAT(DATEFROMPARTS(C.IncYr, C.IncMth, 1), 'MMMM yyyy') AS MonthOfIncome,
        C.TransNo AS TransNo,
        FORMAT(C.TransDate, 'dd/MM/yyyy') AS TransDate,
        C.IncAmt AS IncomeAmt,
        C.EPFAmt AS EPFAmt,
        C.PCBAmt AS TaxAmt
        FROM PR_PCBArrearsDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_PCBArrearsIncDet C ON A.PCBArrearsDetKey = C.PCBArrearsDetKey
        WHERE A.PCBArrearsHdrKey IN (
            SELECT PCBArrearsHdrKey 
            FROM PR_PCBArrearsHdr H
            LEFT JOIN GMS_OUStp F ON H.OUKey = F.OUKey
            WHERE H.Yr = @Date
            AND F.OUCode + ' - ' + F.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create','Automation Testing Edit')
        )`;
      break;

    case "Staff Loan/Deposit Maintenance":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        D.PayCode + ' - ' + D.PayDesc AS DeductionCode,
        C.Amt AS Amount,
        C.Remarks AS Remarks
        FROM PR_OutsMaintDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_OutsMaintDeductDet C ON A.OutsMaintDetKey = C.OutsMaintDetKey
        LEFT JOIN GMS_PayCodeStp D ON C.PayCodeKey = D.PayKey
        WHERE A.OutsMaintHdrKey IN (
        SELECT OutsMaintHdrKey 
        FROM PR_OutsMaintHdr E
        LEFT JOIN GMS_OUStp F ON E.OUKey = F.OUKey
        LEFT JOIN GMS_RecTypeStp G ON E.RecTypeKey = G.RecTypeKey
        WHERE IIF(@region = 'IND',
          FORMAT(E.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(E.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) = @Date 
        AND F.OUCode + ' - ' + F.OUDesc = @OU
        AND G.RecTypeCode + ' - ' + G.RecTypeDesc = @RecType
        AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND')
        );`;
      break;

    case "Staff Advance Payment":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        A.Amt AS Amount
        FROM PR_AdvPayDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        WHERE AdvPayHdrKey IN (
          SELECT AdvPayHdrKey FROM PR_AdvPayHdr
          WHERE AdvPayNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Staff Preceding Tax (PPh 21)":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        B.GrossIncome AS GrossIncome,
        B.BPJSJHT AS BPJSJHTAmt,
        B.BPJSPen AS BPJSPenAmt,
        B.PreDeductedTax AS PPh21
        FROM PR_PreTaxSubDet_IND B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        WHERE PreTaxSubHdrKey IN (
          SELECT PreTaxSubHdrKey FROM PR_PreTaxSubHdr_IND
          WHERE PreTaxSubNum = @DocNo 
          AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
          AND Remarks IN ('Automation Testing Create IND','Automation Testing Edit IND')
        )`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { payrollSQLCommand, payrollGridSQLCommand };
