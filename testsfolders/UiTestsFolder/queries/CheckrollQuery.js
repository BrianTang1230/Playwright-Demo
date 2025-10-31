import Login from "@utils/data/uidata/loginData.json";
const region = process.env.REGION || Login.Region;

function checkrollSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Daily Piece Rate Work":
      if (region === "IND") {
        sqlCommand = `
          SELECT FORMAT(A.ATRDate, 'dd/MM/yyyy') AS ATRDate,
          B.GangCode + ' - ' + B.GangDesc AS Gang,
          A.Remarks AS Remarks,
          C.OUCode + ' - ' + C.OUDesc AS OU
          FROM CR_ATRHdr_IND A
          LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
          LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
          WHERE A.ATRNum = @DocNo
          AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      } else {
        sqlCommand = `
          SELECT FORMAT(A.ATRDate, 'dd/MM/yyyy') AS ATRDate,
          B.GangCode + ' - ' + B.GangDesc AS Gang,
          A.Remarks AS Remarks,
          C.EmpyID + ' - ' + C.EmpyName AS Mandor,
          D.OUCode + ' - ' + D.OUDesc AS OU
          FROM CR_ATRHdr A
          LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
          LEFT JOIN GMS_EmpyPerMas C ON A.HarvManKey = C.EmpyKey
          LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
          WHERE A.ATRNum = @DocNo
          AND OUCode + ' - ' + OUDesc = @OU`;
      }
      break;

    case "Inter-OU Daily Contract Work (Loan To)":
      if (region === "IND") {
        sqlCommand = `
          SELECT FORMAT(A.ATRDate, 'dd/MM/yyyy') AS InterOUAtrDate,
          B.GangCode + ' - ' + B.GangDesc AS Gang,
          A.Remarks AS Remarks,
          C.OUCode + ' - ' + C.OUDesc AS OU,
          D.OUCode + ' - ' + D.OUDesc AS LoanToOU
          FROM CR_InterATRHdr_IND A
          LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
          LEFT JOIN GMS_OUStp C ON A.FromOUKey = C.OUKey
          LEFT JOIN GMS_OUStp D ON A.ToOUKey = D.OUKey
          WHERE A.ATRNum = @DocNo
          AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      } else {
        sqlCommand = `
          SELECT FORMAT(A.ATRDate, 'dd/MM/yyyy') AS InterOUAtrDate,
          B.GangCode + ' - ' + B.GangDesc AS Gang,
          A.Remarks AS Remarks,
          C.EmpyID + ' - ' + C.EmpyName AS Mandor,
          D.OUCode + ' - ' + D.OUDesc AS OU,
          E.OUCode + ' - ' + E.OUDesc AS LoanToOU
          FROM CR_InterATRHdr A
          LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
          LEFT JOIN GMS_EmpyPerMas C ON A.HarvManKey = C.EmpyKey
          LEFT JOIN GMS_OUStp D ON A.FromOUKey = D.OUKey
          LEFT JOIN GMS_OUStp E ON A.ToOUKey = E.OUKey
          WHERE A.ATRNum = @DocNo
          AND D.OUCode + ' - ' + D.OUDesc = @OU`;
      }
      break;

    case "Monthly Piece Rate Work":
      sqlCommand = `
        SELECT FORMAT(A.ATRDate, 'MMMM yyyy') AS MonthlyPRDate,
        B.GangCode + ' - ' + B.GangDesc AS Gang,
        A.Remarks AS Remarks,
        C.EmpyID + ' - ' + C.EmpyName AS Mandor,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM CR_MthPRHdr A
        LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
        LEFT JOIN GMS_EmpyPerMas C ON A.HarvManKey = C.EmpyKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.MthPRNum = @DocNo
        AND OUCode + ' - ' + OUDesc = @OU`;
      break;

    case "Inter-OU Monthly Piece Rate Work":
      sqlCommand = `
        SELECT FORMAT(A.ATRDate, 'MMMM yyyy') AS InterOUMonthlyPRDate,
        B.GangCode + ' - ' + B.GangDesc AS Gang,
        A.Remarks AS Remarks,
        C.EmpyID + ' - ' + C.EmpyName AS Mandor,
        D.OUCode + ' - ' + D.OUDesc AS OU,
        E.OUCode + ' - ' + E.OUDesc AS LoanToOU
        FROM CR_InterMthPRHdr A
        LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
        LEFT JOIN GMS_EmpyPerMas C ON A.HarvManKey = C.EmpyKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        LEFT JOIN GMS_OUStp E ON A.ToOUKey = E.OUKey
        WHERE A.MthPRNum = @DocNo
        AND D.OUCode + ' - ' + D.OUDesc = @OU`;
      break;

    case "Worker Ad hoc Allowance":
      sqlCommand = `
        SELECT
        IIF(@region = 'IND',
          FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy', 'id-ID'),
          FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy', 'en-US')
        ) AS AllowMonth,
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
        SELECT 
        IIF(@region = 'IND',
          FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy', 'id-ID'),
          FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy', 'en-US')
        ) AS DeductMonth,
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
        SELECT 
        IIF(@region = 'IND',
          FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy', 'id-ID'),
          FORMAT(DATEFROMPARTS(A.Yr, A.Mth, 1), 'MMMM yyyy', 'en-US')
        ) AS ReimburseMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_PCHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.AdHocNum = @DocNo AND A.OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;

    case "Worker Additional Remuneration":
      sqlCommand = `
        SELECT    
        IIF(@region = 'IND',
          FORMAT(A.AddRemDate, 'MMMM yyyy','id-ID'),
          FORMAT(A.AddRemDate, 'MMMM yyyy', 'en-US')
        ) AS AddRemMonth,
        B.GangCode + ' - ' + B.GangDesc AS Gang,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_AddRemHdr A
        LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.ADRNum = @DocNo AND A.OUKey IN (
          SELECT OUKey FROM GMS_OUStp
          WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;

    case "Worker Monthly Tax Deduction":
      sqlCommand = `
        SELECT FORMAT(A.PCBDate, 'MMMM yyyy') AS PCBMonth,
        B.GangCode + ' - ' + B.GangDesc AS Gang,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_PCBHdr A
        LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE FORMAT(A.PCBDate, 'MMMM yyyy') = @Date
        AND GangCode + ' - ' + GangDesc = @Gang 
        AND Remarks IN ('Automation Testing Create', 'Automation Testing Edit')`;
      break;

    case "Worker Previous Employment Tax Deduction":
      sqlCommand = `
        SELECT FORMAT(A.PreEmpDate, 'MMMM yyyy') AS PreEmpMonth, 
        B.GangCode + ' - ' + B.GangDesc AS Gang,
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_PreEmpHdr A
        LEFT JOIN GMS_GangStp B ON A.GangKey = B.GangKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE FORMAT(A.PreEmpDate, 'MMMM yyyy') = @Date
        AND B.GangCode + ' - ' + B.GangDesc = @Gang
        AND C.OUCode + ' - ' + C.OUDesc = @OU
        AND Remarks IN ('Automation Testing Create', 'Automation Testing Edit')`;
      break;

    case "Worker CP38":
      sqlCommand = `
        SELECT FORMAT(A.AddTaxDate , 'MMMM yyyy') AS AddTaxMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_AddTaxHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.ATDNum = @DocNo AND A.OUKey IN (
          SELECT OUKey FROM GMS_OUStp 
          WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;

    case "Worker Income Declaration (EA Form)":
      sqlCommand = `
        SELECT A.Yr AS YearDeclared, 
        A.Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_PCBArrearsHdr A
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.Yr = @Date
            AND C.OUCode + ' - ' + C.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create', 'Automation Testing Edit')`;
      break;

    case "Worker Preceding Tax (PPh 21)":
      sqlCommand = `
        SELECT FORMAT(A.PreceedingDate, 'MMMM yyyy', 'id-ID') AS PreceedingMonth,
        A.Remarks AS Remarks,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_PreTaxSubHdr_IND A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.PreTaxSubNum = @DocNo 
        AND A.OUKey IN (
          SELECT OUKey FROM GMS_OUStp
          WHERE OUCode + ' - ' + OUDesc = @OU
        )
        AND A.Remarks IN ('Automation Testing Create IND','Automation Testing Edit IND')`;
      break;

    case "Create Rainfall Entry":
      sqlCommand = `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.RainfallDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.RainfallDate, 'MMMM yyyy', 'en-US')
        ) AS RFMonth,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM CR_RainfallDistHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE  
        IIF(@region = 'IND',
            FORMAT(A.RainfallDate, 'MMMM yyyy', 'id-ID'),
            FORMAT(A.RainfallDate, 'MMMM yyyy', 'en-US')
        ) = @Date AND A.OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
        )`;
      break;

    case "Worker Loan/Deposit Maintenance":
      sqlCommand = `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) AS LoanDepMonth,
        B.RecTypeCode + ' - ' + B.RecTypeDesc AS RecType,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_OutsMaintHdr A
        LEFT JOIN GMS_RecTypeStp B ON A.RecTypeKey = B.RecTypeKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE   
        IIF(@region = 'IND',
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.OutsMaintDate, 'MMMM yyyy', 'en-US')
        ) = @Date
        AND C.OUCode + ' - ' + C.OUDesc = @OU
        AND B.RecTypeCode + ' - ' + B.RecTypeDesc = @RecType
        AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND')`;
      break;

    case "Worker Advance Payment":
      sqlCommand = `
        SELECT 
        IIF(@region = 'IND',
          FORMAT(A.AdvPayDate, 'MMMM yyyy', 'id-ID'),
          FORMAT(A.AdvPayDate, 'MMMM yyyy', 'en-US')
        ) AS ADVMonth,
        A.Remarks AS Remarks,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_AdvPayHdr A 
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.AdvPayNum = @DocNo AND C.OUCode + ' - ' + C.OUDesc = @OU`;
      break;

    case "Mill CPO and PK":
      sqlCommand = `
        SELECT A.FY AS FiscYear,
        A.Period AS Period,
        B.DivCode + ' - ' + B.DivDesc AS Division,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM CR_MillCPOPKHdr A
        LEFT JOIN GMS_DivStp B ON A.DivKey = B.DivKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE FY = @FYear 
        AND Period = @Period
        AND DivCode + ' - ' + DivDesc = @Div
        AND OUCode + ' - ' + OUDesc = @OU`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function checkrollGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Daily Piece Rate Work":
      if (region === "IND") {
        sqlCommand = `
          SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
          D.AttdCode AS AttendanceCode,
          CONVERT(VARCHAR(5), B.TimeIn, 108) AS ClockIn,
          CONVERT(VARCHAR(5), B.TimeOut, 108) AS ClockOut,
          B.Rest AS Rest,
          F.AccNum + ' - ' + F.AccDesc AS Account,
          G.CCIDCode + ' - ' + G.CCIDDesc AS CCID,
          E.MD AS ManDay,
          (E.OTH1 + E.OTH2 + E.OTH3 + E.OTH4) AS OT,
          E.Allowance AS Allowance,
          E.Remarks AS Remarks,
          I.ACode + ' - ' + I.ACodeDesc AS ActivityCode,
          J.CCIDCode + ' - ' + J.CCIDDesc AS PRCCID,
          CASE WHEN H.EnableBasicPay = 1 THEN 'True' ELSE 'False' END AS DailyRateAsPayRate,
          H.Qty AS PayQty,
          H.Remarks AS PRRemarks
          FROM CR_ATRDet_IND B
          LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
          LEFT JOIN GMS_AttdCodeStp D ON B.AttdKey = D.AttdKey
          LEFT JOIN CR_ATRAllocDet_IND E ON B.ATRDetKey = E.ATRDetKey
          LEFT JOIN GMS_AccMas F ON E.ExpAccKey = F.AccKey
          LEFT JOIN V_SYC_CCIDMapping G On E.CCIDKey = G.CCIDKey 
          LEFT JOIN CR_PieceRateDet_IND H ON B.ATRDetKey = H.ATRDetKey
          LEFT JOIN GMS_ActivityCodeStp I ON H.ActivityKey = I.ACodeKey
          LEFT JOIN V_SYC_CCIDMapping J On H.CCIDKey = J.CCIDKey
          WHERE B.ATRHdrKey IN (
              SELECT ATRHdrKey FROM CR_ATRHdr_IND K
              LEFT JOIN GMS_OUStp L ON K.OUKey = L.OUKey
              WHERE K.ATRNum = @DocNo
              AND L.OUCode + ' - ' + L.OUDesc = @OU
          )`;
      } else {
        sqlCommand = `
          SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
          D.AttdCode AS AttendanceCode,
          F.AccNum + ' - ' + F.AccDesc AS Account,
          G.CCIDCode + ' - ' + G.CCIDDesc AS CCID,
          E.MD AS ManDay,
          (E.OTH1 + E.OTH2 + E.OTH3) AS OT,
          E.AllowAmt AS Allowance,
          E.Remarks AS Remarks,
          I.ACode + ' - ' + I.ACodeDesc AS ActivityCode,
          J.CCIDCode + ' - ' + J.CCIDDesc AS PRCCID,
          CASE WHEN H.EnableBasicPay = 1 THEN 'True' ELSE 'False' END AS DailyRateAsPayRate,
          H.PayQty AS PayQty,
          H.OTPayQty AS OvertimePay,
          H.Remarks AS PRRemarks
          FROM CR_ATRDet B
          LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
          LEFT JOIN GMS_AttdCodeStp D ON B.AttdKey = D.AttdKey
          LEFT JOIN CR_ATRAllocDet E ON B.ATRDetKey = E.ATRDetKey
          LEFT JOIN GMS_AccMas F ON E.AccKey = F.AccKey
          LEFT JOIN V_SYC_CCIDMapping G On E.CCIDKey = G.CCIDKey 
          LEFT JOIN CR_PieceRateDet H ON B.ATRDetKey = H.ATRDetKey
          LEFT JOIN GMS_ActivityCodeStp I ON H.ActivityKey = I.ACodeKey
          LEFT JOIN V_SYC_CCIDMapping J On H.CCIDKey = J.CCIDKey 
          WHERE B.ATRHdrKey IN (
            SELECT ATRHdrKey FROM CR_ATRHdr K
            LEFT JOIN GMS_OUStp L ON K.OUKey = L.OUKey
            WHERE K.ATRNum = @DocNo
            AND L.OUCode + ' - ' + L.OUDesc = @OU
          )`;
      }
      break;

    case "Inter-OU Daily Contract Work (Loan To)":
      if (region === "IND") {
        sqlCommand = `
          SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
          D.AttdCode AS AttendanceCode,
          CONVERT(VARCHAR(5), B.TimeIn, 108) AS ClockIn,
          CONVERT(VARCHAR(5), B.TimeOut, 108) AS ClockOut,
          B.Rest AS Rest,
          F.AccNum + ' - ' + F.AccDesc AS Account,
          G.CCIDCode + ' - ' + G.CCIDDesc AS CCID,
          E.MD AS ManDaynumeric,
          (E.OTH1 + E.OTH2 + E.OTH3 + E.OTH4) AS OTnumeric,
          E.Allowance AS Allowance,
          E.Remarks AS Remarks,
          I.ACode + ' - ' + I.ACodeDesc AS ActivityCode,
          J.CCIDCode + ' - ' + J.CCIDDesc AS PRCCID,
          CASE WHEN H.EnableBasicPay = 1 THEN 'True' ELSE 'False' END AS DailyRateAsPayRate,
          H.Qty AS PayQty,
          H.Remarks AS PRRemarks
          FROM CR_InterATRDet_IND B
          LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
          LEFT JOIN GMS_AttdCodeStp D ON B.AttdKey = D.AttdKey
          LEFT JOIN CR_InterATRAllocDet_IND E ON B.ATRDetKey = E.ATRDetKey
          LEFT JOIN GMS_AccMas F ON E.AccKey = F.AccKey
          LEFT JOIN V_SYC_CCIDMapping G On E.CCIDKey = G.CCIDKey 
          LEFT JOIN CR_InterPieceRateDet_IND H ON B.ATRDetKey = H.ATRDetKey
          LEFT JOIN GMS_ActivityCodeStp I ON H.ActivityKey = I.ACodeKey
          LEFT JOIN V_SYC_CCIDMapping J On H.CCIDKey = J.CCIDKey
          WHERE B.ATRHdrKey IN (
              SELECT ATRHdrKey FROM CR_InterATRHdr_IND K
              LEFT JOIN GMS_OUStp L ON K.FromOUKey = L.OUKey
              WHERE K.ATRNum = @DocNo
              AND L.OUCode + ' - ' + L.OUDesc = @OU
          )`;
      } else {
        sqlCommand = `
          SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
          D.AttdCode AS AttendanceCode,
          F.AccNum + ' - ' + F.AccDesc AS Account,
          G.CCIDCode + ' - ' + G.CCIDDesc AS CCID,
          E.MD AS ManDay,
          (E.OTH1 + E.OTH2 + E.OTH3) AS OT,
          E.AllowAmt AS Allowance,
          E.Remarks AS Remarks,
          I.ACode + ' - ' + I.ACodeDesc AS ActivityCode,
          J.CCIDCode + ' - ' + J.CCIDDesc AS PRCCID,
          CASE WHEN H.EnableBasicPay = 1 THEN 'True' ELSE 'False' END AS DailyRateAsPayRate,
          H.PayQty AS PayQty,
          H.OTPayQty AS OvertimePay,
          H.Remarks AS PRRemarks
          FROM CR_InterATRDet B
          LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
          LEFT JOIN GMS_AttdCodeStp D ON B.AttdKey = D.AttdKey
          LEFT JOIN CR_InterATRAllocDet E ON B.ATRDetKey = E.ATRDetKey
          LEFT JOIN GMS_AccMas F ON E.AccKey = F.AccKey
          LEFT JOIN V_SYC_CCIDMapping G On E.CCIDKey = G.CCIDKey 
          LEFT JOIN CR_InterPieceRateDet H ON B.ATRDetKey = H.ATRDetKey
          LEFT JOIN GMS_ActivityCodeStp I ON H.ActivityKey = I.ACodeKey
          LEFT JOIN V_SYC_CCIDMapping J On H.CCIDKey = J.CCIDKey 
          WHERE B.ATRHdrKey IN (
              SELECT ATRHdrKey FROM CR_InterATRHdr K
              LEFT JOIN GMS_OUStp L ON K.FromOUKey = L.OUKey
              WHERE K.ATRNum = @DocNo
              AND L.OUCode + ' - ' + L.OUDesc = @OU
          )`;
      }
      break;

    case "Monthly Piece Rate Work":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        D.ACode + ' - ' + D.ACodeDesc AS ActivityCode,
        E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
        B.MD AS ManDay,
        CASE B.WorkOn 
        WHEN 'OT' THEN 'Overtime'
        WHEN 'RD' THEN 'Rest Day'
        WHEN 'PH' THEN 'Public Holiday'
        ELSE '' END AS WorkOn,
        CASE WHEN B.IsDRAsPayRate = 1 THEN 'True' ELSE 'False' END AS DailyRateAsPayRate,
        B.PayQty AS PayQty,
        B.Remarks AS Remarks
        FROM CR_MthPRDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN GMS_ActivityCodeStp D ON B.ActivityKey = D.ACodeKey
        LEFT JOIN V_SYC_CCIDMapping E On B.CCIDKey = E.CCIDKey 
        WHERE B.MthPRHdrKey IN (
          SELECT MthPRHdrKey FROM CR_MthPRHdr F
          LEFT JOIN GMS_OUStp G ON F.OUKey = G.OUKey
          WHERE F.MthPRNum = @DocNo
          AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Inter-OU Monthly Piece Rate Work":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        D.ACode + ' - ' + D.ACodeDesc AS ActivityCode,
        E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
        B.MD AS ManDay,
        CASE B.WorkOn 
        WHEN 'OT' THEN 'Overtime'
        WHEN 'RD' THEN 'Rest Day'
        WHEN 'PH' THEN 'Public Holiday'
        ELSE '' END AS WorkOn,
        CASE WHEN B.IsDRAsPayRate = 1 THEN 'True' ELSE 'False' END AS DailyRateAsPayRate,
        B.PayQty AS PayQty,
        B.Remarks AS Remarks
        FROM CR_InterMthPRDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN GMS_ActivityCodeStp D ON B.ActivityKey = D.ACodeKey       
        LEFT JOIN V_SYC_CCIDMapping E On B.CCIDKey = E.CCIDKey
        WHERE B.MthPRHdrKey IN (
            SELECT MthPRHdrKey FROM CR_InterMthPRHdr F
            LEFT JOIN GMS_OUStp G ON F.OUKey = G.OUKey
            WHERE F.MthPRNum = @DocNo
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

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

    case "Worker Additional Remuneration":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        E.AddRemCode + ' - ' + E.AddRemDesc AS AddRem,
        D.AddRemAmt AS Amount
        FROM CR_AddRemDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN CR_AddRemDedDet D ON B.AddRemDetKey = D.AddRemDetKey
        LEFT JOIN GMS_AddRemStp E ON D.AddRemKey = E.AddRemKey
        WHERE AddRemHdrKey IN (
          SELECT AddRemHdrKey FROM CR_AddRemHdr
          WHERE ADRNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Worker Monthly Tax Deduction":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        B.ZakatAmt AS Zakat,
        B.LevyAmt AS Levy,
        B.VOLA AS VOLAAmt,
        MAX(CASE WHEN D.Type = 'B' THEN E.TaxDedCode + ' - ' + E.TaxDedDesc END) AS BIK,
        SUM(CASE WHEN D.Type = 'B' THEN D.DedAmt ELSE 0 END) AS BIKnumeric,
        MAX(CASE WHEN D.Type = 'A' THEN E.TaxDedCode + ' - ' + E.TaxDedDesc END) AS AD,
        SUM(CASE WHEN D.Type = 'A' THEN D.DedAmt ELSE 0 END) AS ADnumeric
        FROM CR_PCBDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        LEFT JOIN CR_PCBDedDet D ON B.PCBDetKey = D.PCBDetKey
        LEFT JOIN SYT_TaxDed E ON D.TaxDedKey = E.TaxDedKey
        WHERE B.PCBHdrKey IN (
          SELECT PCBHdrKey FROM CR_PCBHdr F
          LEFT JOIN GMS_GangStp G ON F.GangKey = G.GangKey
          LEFT JOIN GMS_OUStp H ON F.OUKey = H.OUKey
          WHERE
          IIF(@region = 'IND',
            FORMAT(F.PCBDate, 'MMMM yyyy', 'id-ID'),
            FORMAT(F.PCBDate, 'MMMM yyyy', 'en-US')
          ) = @Date
          AND G.GangCode + ' - ' + G.GangDesc = @Gang 
          AND H.OUCode + ' - ' + H.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create', 'Automation Testing Edit')
        )
        GROUP BY 
        C.EmpyID, EmpyName, 
        B.ZakatAmt, B.LevyAmt, B.VOLA
      `;
      break;

    case "Worker Previous Employment Tax Deduction":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee,
        CASE WHEN A.IsNewJoiner = 1 THEN 'True' ELSE 'False' END AS IsNewJoiner,
        A.NormalRem AS NorRemnumeric,
        A.EPF AS EPFnumeric,
        SUM(CASE WHEN C.Type = 'A' AND (D.TaxDedCode + ' - ' + D.TaxDedDesc) = 'SOCSO - SOCSO and EIS payment' THEN C.DedAmt ELSE 0 END) AS SOSOCnumeric,
        A.AddRem AS AddRemnumeric,
        CASE WHEN A.IsInclAddRemInPCBCalc = 1 THEN 'True' ELSE 'False' END AS InclAddRem,
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
        FROM CR_PreEmpDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN CR_PreEmpDedDet C ON A.PreEmpDetKey = C.PreEmpDetKey
        LEFT JOIN SYT_TaxDed D ON C.TaxDedKey = D.TaxDedKey
        WHERE A.PreEmpHdrKey IN (
            SELECT PreEmpHdrKey 
            FROM CR_PreEmpHdr H
            LEFT JOIN GMS_GangStp E ON H.GangKey = E.GangKey
            LEFT JOIN GMS_OUStp F ON H.OUKey = F.OUKey
            WHERE FORMAT(H.PreEmpDate, 'MMMM yyyy') = @Date
            AND E.GangCode + ' - ' + E.GangDesc = @Gang
            AND F.OUCode + ' - ' + F.OUDesc = @OU
            AND Remarks IN ('Automation Testing Create', 'Automation Testing Edit')
        )
        GROUP BY 
        B.EmpyID, EmpyName,
        A.IsNewJoiner,NormalRem,EPF,AddRem,IsInclAddRemInPCBCalc,AddEPF,VOLA,NormalAlw,Allowance,ChildAllw,FreeGoods,Perquisite,Others,TotDeduct,TotZakat,TotLevy,CP38
      `;
      break;

    case "Worker CP38":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        B.AddTaxAmt AS Amount
        FROM CR_AddTaxDet B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        WHERE AddTaxHdrKey IN (
        SELECT AddTaxHdrKey FROM CR_AddTaxHdr
        WHERE ATDNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp 
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Worker Income Declaration (EA Form)":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + EmpyName AS Employee,
        C.IncType AS IncomeType,
        FORMAT(DATEFROMPARTS(C.IncYr, C.IncMth, 1), 'MMMM yyyy') AS MonthOfIncome,
        C.TransNo AS TransNo,
        FORMAT(C.TransDate, 'dd/MM/yyyy') AS TransDate,
        C.IncAmt AS IncomeAmt,
        C.EPFAmt AS EPFAmt,
        C.PCBAmt AS TaxAmt
        FROM CR_PCBArrearsDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN CR_PCBArrearsIncDet C ON A.PCBArrearsDetKey = C.PCBArrearsDetKey
        WHERE A.PCBArrearsHdrKey IN (
          SELECT PCBArrearsHdrKey 
          FROM CR_PCBArrearsHdr H
          LEFT JOIN GMS_OUStp F ON H.OUKey = F.OUKey
          WHERE H.Yr = @Date
          AND F.OUCode + ' - ' + F.OUDesc = @OU
          AND Remarks IN ('Automation Testing Create', 'Automation Testing Edit')
        )`;
      break;

    case "Worker Preceding Tax (PPh 21)":
      sqlCommand = `
        SELECT C.EmpyID + ' - ' + C.EmpyName AS Employee,
        B.GrossIncome AS GrossIncome,
        B.BPJSJHT AS BPJSJHTAmt,
        B.BPJSPen AS BPJSPenAmt,
        B.PreDeductedTax AS PPh21
        FROM CR_PreTaxSubDet_IND B
        LEFT JOIN GMS_EmpyPerMas C ON B.EmpyKey = C.EmpyKey
        WHERE PreTaxSubHdrKey IN (
          SELECT PreTaxSubHdrKey FROM CR_PreTaxSubHdr_IND
          WHERE PreTaxSubNum = @DocNo 
          AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
          AND Remarks IN ('Automation Testing Create IND','Automation Testing Edit IND')
        )`;
      break;
    case "Create Rainfall Entry":
      sqlCommand = `
        SELECT C.DivCode + ' - ' + C.DivDesc AS Division,
        B.Day01 AS D1,
        B.Day02 AS D2,
        B.Day03 AS D3,
        B.Day04 AS D4,
        B.Day05 AS D5
        FROM CR_RainfallDistDet B
        LEFT JOIN GMS_DivStp C ON B.DivKey = C.DivKey
        WHERE B.CRRainFallHdrKey IN (
          SELECT CRRainFallHdrKey FROM CR_RainfallDistHdr
          WHERE IIF(@region = 'IND',
            FORMAT(RainfallDate, 'MMMM yyyy', 'id-ID'),
            FORMAT(RainfallDate, 'MMMM yyyy', 'en-US')
          ) = @Date 
          AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Worker Loan/Deposit Maintenance":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        D.PayCode + ' - ' + D.PayDesc AS DeductionCode,
        C.Amt AS Amount,
        C.Remarks AS Remarks
        FROM CR_OutsMaintDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        LEFT JOIN CR_OutsMaintDeductDet C ON A.OutsMaintDetKey = C.OutsMaintDetKey
        LEFT JOIN GMS_PayCodeStp D ON C.PayCodeKey = D.PayKey
        WHERE A.OutsMaintHdrKey IN (
          SELECT OutsMaintHdrKey 
          FROM CR_OutsMaintHdr E
          LEFT JOIN GMS_OUStp F ON E.OUKey = F.OUKey
          LEFT JOIN GMS_RecTypeStp G ON E.RecTypeKey = G.RecTypeKey
          WHERE IIF(@region = 'IND',
            FORMAT(E.OutsMaintDate, 'MMMM yyyy', 'id-ID'),
            FORMAT(E.OutsMaintDate, 'MMMM yyyy', 'en-US')
          ) = @Date 
          AND F.OUCode + ' - ' + F.OUDesc = @OU
          AND G.RecTypeCode + ' - ' + G.RecTypeDesc = @RecType
          AND Remarks IN ('Automation Testing Create','Automation Testing Edit','Automation Testing Create IND','Automation Testing Edit IND')
        )`;
      break;

    case "Worker Advance Payment":
      sqlCommand = `
        SELECT B.EmpyID + ' - ' + B.EmpyName AS Employee,
        A.Amt AS Amount
        FROM CR_AdvPayDet A
        LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
        WHERE AdvPayHdrKey IN (
          SELECT AdvPayHdrKey FROM CR_AdvPayHdr
          WHERE AdvPayNum = @DocNo AND OUKey IN (
            SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;

    case "Mill CPO and PK":
      sqlCommand = `
        SELECT C.MillCode + ' - ' + C.MillDesc AS Mill,
        B.CPO AS CPOAmt,
        B.PK AS PKAmt
        FROM CR_MillCPOPKDet B
        LEFT JOIN GMS_MillStp C ON B.MillKey = C.MillKey
        LEFT JOIN CR_MillCPOPKHdr D ON B.MCPHdrKey = D.MCPHdrKey
        LEFT JOIN GMS_DivStp E ON D.DivKey = D.DivKey
        LEFT JOIN GMS_OUStp F ON D.OUKey = E.OUKey
        WHERE FY = @FYear 
        AND Period = @Period
        AND DivCode + ' - ' + DivDesc = @Div
        AND OUCode + ' - ' + OUDesc = @OU`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { checkrollSQLCommand, checkrollGridSQLCommand };
