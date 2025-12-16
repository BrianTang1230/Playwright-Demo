function payrollSQLCommand(formName) {
  let sqlCommand = `
    DECLARE @OU VARCHAR(100) = 
      CASE WHEN @region = 'IND'
        THEN 'TSPE - TANI SEJAHTERA PERKASA ESTATE'
        ELSE 'BNG - BINUANG ESTATE'
    END;
  `;

  switch (formName) {
    case "Staff Additional Remuneration":
      sqlCommand += `
        SELECT IIF(@region = 'IND',
          FORMAT(A.AddRemDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.AddRemDate, 'MMMM yyyy', 'en-US')
        ) AS StaffAddRemDate,
        B.DeptCode + ' - ' + B.DeptDesc AS Department,
        A.Remarks,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
          WHEN 'S' THEN 'SUBMITTED'
          WHEN 'A' THEN 'APPROVED'
        END AS Status,
        CASE
          WHEN A.Cycle = 1 THEN 'True'
          ELSE 'False'
        END AS Cycle1,
        CASE
          WHEN A.Cycle = 2 THEN 'True'
          ELSE 'False'
        END AS Cycle2,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_AddRemHdr A
        LEFT JOIN GMS_DeptStp B ON A.DeptKey = B.DeptKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.ADRNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Staff Monthly Tax Deduction":
      sqlCommand += `
        SELECT FORMAT(A.PCBDate, 'MMMM yyyy') AS PCBMonth, 
        B.DeptCode + ' - ' + B.DeptDesc AS Department,
        A.Remarks,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
          WHEN 'S' THEN 'SUBMITTED'
          WHEN 'A' THEN 'APPROVED'
        END AS Status,
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
      sqlCommand += `
        SELECT FORMAT(A.PreEmpDate, 'MMMM yyyy') AS PreEmpMonth, 
        B.DeptCode + ' - ' + B.DeptDesc AS Department,
        A.Remarks,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
          WHEN 'S' THEN 'SUBMITTED'
          WHEN 'A' THEN 'APPROVED'
        END AS Status,
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
      sqlCommand += `
        SELECT FORMAT(A.AddTaxDate, 'MMMM yyyy') AS AddTaxMonth, 
        A.Remarks,
        CASE A.Status
            WHEN 'O' THEN 'OPEN'
            WHEN 'C' THEN 'CLOSE'
            WHEN 'S' THEN 'SUBMITTED'
            WHEN 'A' THEN 'APPROVED'
        END AS Status,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_AddTaxHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.ADTNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Staff Income Declaration (EA Form)":
      sqlCommand += `
        SELECT A.Yr AS YearDeclared, 
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_PCBArrearsHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.ARSNum = @DocNo
			  AND A.Yr = @Date
        AND C.OUCode + ' - ' + C.OUDesc = @OU
        AND Remarks IN ('Automation Testing Create','Automation Testing Edit')`;
      break;

    case "Staff Loan/Deposit Maintenance":
      sqlCommand += `
        SELECT  IIF(@region = 'IND',
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) AS OMMonth,
        B.RecTypeCode + ' - ' + B.RecTypeDesc AS RecType,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_OutsMaintHdr A
        LEFT JOIN GMS_RecTypeStp B ON A.RecTypeKey = B.RecTypeKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE IIF(@region = 'IND',
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) = @Date
        AND C.OUCode + ' - ' + C.OUDesc = @OU
        AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND')`;
      break;

    case "Staff Advance Payment":
      sqlCommand += `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.AdvPayDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.AdvPayDate, 'MMMM yyyy', 'en-US')
        ) AS ADVMonth,
        A.Remarks AS Remarks,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
          WHEN 'S' THEN 'SUBMITTED'
          WHEN 'A' THEN 'APPROVED'
        END AS Status,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM PR_AdvPayHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.AdvPayNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Staff Preceding Tax (PPh 21)":
      sqlCommand += `
        SELECT FORMAT(A.PrecedingDate, 'MMMM yyyy', 'id-ID') AS PrecedingMonth,
        A.Remarks,
        CASE A.Status
          WHEN 'O' THEN 'OPEN'
          WHEN 'C' THEN 'CLOSE'
          WHEN 'S' THEN 'SUBMITTED'
          WHEN 'A' THEN 'APPROVED'
        END AS Status,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM PR_PreTaxSubHdr_IND A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.PreTaxSubNum = @DocNo 
		    AND FORMAT(A.PrecedingDate, 'MMMM yyyy', 'id-ID') = @Date
        AND B.OUCode + ' - ' + B.OUDesc = @OU
        AND A.Remarks IN ('Automation Testing Create IND','Automation Testing Edit IND')`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function payrollGridSQLCommand(formName) {
  let sqlCommand = `
  DECLARE @OU VARCHAR(100) = 
      CASE WHEN @region = 'IND'
        THEN 'TSPE - TANI SEJAHTERA PERKASA ESTATE'
        ELSE 'BNG - BINUANG ESTATE'
    END;
    `;

  switch (formName) {
    case "Staff Additional Remuneration":
      sqlCommand += `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        C.AddRemAmt AS Tnumeric,
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
      sqlCommand += `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee, 
        A.ZakatAmt AS Zakatnumeric,
        A.LevyAmt AS Levynumeric,
        A.VOLA AS VOLAnumeric,
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
      sqlCommand += `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee,
        CASE
          WHEN A.IsNewJoiner = 1 THEN 'True'
          ELSE 'False'
        END AS IsNewJoiner,
        A.NormalRem AS NormalRemnumeric,
        A.EPF AS EPFnumeric,
        MAX(CASE WHEN D.TaxDedCode = 'SOCSO' THEN C.DedAmt END) AS SOCSOnumeric,
        A.AddRem AS ARnumeric,
        CASE
          WHEN A.IsInclAddRemInPCBCalc = 1 THEN 'True'
          ELSE 'False'
        END AS IsInclAddRemInPCBCalc,
        A.AddEPF AS AEnumeric,
        A.VOLA AS VOLAnumeric,
        A.NormalAlw AS NAnumeric,
        A.Allowance AS Anumeric,
        A.ChildAllw AS CAnumeric,
        A.FreeGoods AS FGnumeric,
        A.Perquisite AS Pnumeric,
        A.Others AS Onumeric,
        A.TotDeduct AS TDnumeric,
        A.TotZakat AS Zakatnumeric,
        A.TotLevy AS Levynumeric,
        A.CP38 AS CPnumeric,
        MAX(CASE WHEN C.Type = 'B' AND D.TaxDedCode <> 'SOCSO' 
        THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS BIK,
        SUM(CASE WHEN C.Type = 'B' AND D.TaxDedCode <> 'SOCSO' 
        THEN C.DedAmt ELSE 0 END) AS BIKnumeric,
        MAX(CASE WHEN C.Type = 'A' AND D.TaxDedCode <> 'SOCSO' 
        THEN D.TaxDedCode + ' - ' + D.TaxDedDesc END) AS AD,
        SUM(CASE WHEN C.Type = 'A' AND D.TaxDedCode <> 'SOCSO' 
        THEN C.DedAmt ELSE 0 END) AS ADnumeric
        FROM PR_PreEmpDet A
        LEFT JOIN GMS_EmpyPerMas B 
          ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_PreEmpDedDet C 
          ON A.PreEmpDetKey = C.PreEmpDetKey
        LEFT JOIN SYT_TaxDed D 
          ON C.TaxDedKey = D.TaxDedKey
        WHERE A.PreEmpHdrKey IN (
          SELECT H.PreEmpHdrKey
          FROM PR_PreEmpHdr H
          LEFT JOIN GMS_DeptStp Dept ON H.DeptKey = Dept.DeptKey
          LEFT JOIN GMS_OUStp OU   ON H.OUKey  = OU.OUKey
          WHERE FORMAT(H.PreEmpDate, 'MMMM yyyy') = @Date
            AND Dept.DeptCode + ' - ' + Dept.DeptDesc = @Dept
            AND OU.OUCode + ' - ' + OU.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create','Automation Testing Edit')
        )
        GROUP BY 
          B.EmpyID, EmpyName,AddRem,
          A.TotZakat, A.TotLevy, A.VOLA,IsInclAddRemInPCBCalc,AddEPF,NormalAlw,Allowance,ChildAllw,
          A.IsNewJoiner,FreeGoods,Perquisite,Others,TotDeduct,CP38,
          A.NormalRem,
          A.EPF`;
      break;

    case "Staff CP38":
      sqlCommand += `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        A.AddTaxAmt AS TaxAmtnumeric
        FROM PR_AddTaxDet A
        INNER JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey AND B.OUKey IN (
          SELECT OUKey FROM GMS_OUStp WHERE OUCode + ' - ' + OUDesc = @OU
        )
        INNER JOIN PR_AddTaxHdr C ON A.AddTaxHdrKey = C.AddTaxHdrKey`;
      break;

    case "Staff Income Declaration (EA Form)":
      sqlCommand += `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee,
        D.DeptCode,
        C.IncAmt AS IncAmtnumeric,
        C.EPFAmt AS EPFAmtnumeric,
        C.PCBAmt AS TaxAmtnumeric,
        C.IncType AS IncomeType,
        FORMAT(DATEFROMPARTS(C.IncYr, C.IncMth, 1), 'MMMM yyyy') AS MonthOfIncome,
        C.TransNo AS TransNo,
        FORMAT(C.TransDate, 'dd/MM/yyyy') AS TransDate,
        C.IncAmt AS IncAmt2numeric,
        C.EPFAmt AS EPFAmt2numeric,
        C.PCBAmt AS TaxAmt2numeric
        FROM PR_PCBArrearsDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_PCBArrearsIncDet C ON A.PCBArrearsDetKey = C.PCBArrearsDetKey
        LEFT JOIN GMS_DeptStp D ON B.DeptKey = D.DeptKey
        WHERE A.PCBArrearsHdrKey IN (
          SELECT PCBArrearsHdrKey 
          FROM PR_PCBArrearsHdr H
          LEFT JOIN GMS_OUStp F ON H.OUKey = F.OUKey
          WHERE H.ARSNum = @DocNo
		      AND H.Yr = @Date  
          AND F.OUCode + ' - ' + F.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND')
        )`;
      break;

    case "Staff Loan/Deposit Maintenance":
      sqlCommand += `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
		    E.DeptCode AS Department,
        C.Amt AS Amtnumeric,
        D.PayCode + ' - ' + D.PayDesc AS DeductionCode,
        C.Amt AS Amt2numeric,
        CASE C.IsTransfer
          WHEN 1 THEN 'True'
          WHEN 0 THEN 'False'
        END AS IsTransfer,
        C.Remarks AS Remarks
        FROM PR_OutsMaintDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN PR_OutsMaintDeductDet C ON A.OutsMaintDetKey = C.OutsMaintDetKey
        LEFT JOIN GMS_PayCodeStp D ON C.PayCodeKey = D.PayKey
        LEFT JOIN GMS_DeptStp E ON B.DeptKey = E.DeptKey
        LEFT JOIN GMS_PayCodeProHdr F ON C.PayCodeKey = F.PayCodeProKey
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
        AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND')
        )`;
      break;

    case "Staff Advance Payment":
      sqlCommand += `
        SELECT 
        B.EmpyID + ' - ' + B.EmpyName AS Employee,
        C.DeptCode + ' - ' + C.DeptDesc AS Department,
        A.Amt AS Amtnumeric
        FROM PR_AdvPayDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN GMS_DeptStp C ON B.DeptKey = C.DeptKey
        WHERE AdvPayHdrKey IN (
          SELECT AdvPayHdrKey FROM PR_AdvPayHdr
          WHERE AdvPayNum = @DocNo AND OUKey IN (
          SELECT OUKey FROM GMS_OUStp
          WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Staff Preceding Tax (PPh 21)":
      sqlCommand += `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        B.GrossIncome AS GInumeric,
        B.BPJSJHT AS BPJSJHTAmtnumeric,
        B.BPJSPen AS BPJSPenAmtnumeric,
        B.PreDeductedTax AS PPh21
        FROM PR_PreTaxSubDet_IND B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN PR_PreTaxSubHdr_IND D ON B.PreTaxSubHdrKey = D.PreTaxSubHdrKey
        LEFT JOIN GMS_OUStp E ON E.OUKey = D.OUKey
        WHERE D.PreTaxSubNum = @DocNo
        AND E.OUCode + ' - ' + E.OUDesc = @OU
        AND D.Remarks IN ('Automation Testing Create IND','Automation Testing Edit IND')
        AND FORMAT(D.PrecedingDate, 'MMMM yyyy', 'id-ID') = @Date`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { payrollSQLCommand, payrollGridSQLCommand };
