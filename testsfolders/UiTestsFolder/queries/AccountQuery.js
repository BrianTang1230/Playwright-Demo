import Login from "@utils/data/uidata/loginData.json";
const region = process.env.REGION || Login.Region;

function accountSQLCommand(formName) {
  let sqlCommand = `
   DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
         THEN 'TSPE - TANI SEJAHTERA PERKASA ESTATE'
         ELSE 'BNG - BINUANG ESTATE'
    END;
    DECLARE @OU2 VARCHAR(100) =
      CASE WHEN @region = 'IND'
         THEN 'SPSH - PT. SURYA PALMA SEJAHTERA'
         ELSE 'BWHO - HEAD OFFICE'
    END;
  `;

  switch (formName) {
    case "General Journal":
      sqlCommand += `
        SELECT 
            FORMAT(A.GLDate, 'dd/MM/yyyy') AS JournalDate,
            A.GLDesc AS Description, 
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,
            B.OUCode + ' - ' + B.OUDesc AS OU
        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.DocNum = @DocNo 
        AND B.OUCode + ' - ' + B.OUDesc = @OU`;
      break;

    case "Closed Period Adjustment":
      sqlCommand += `
        SELECT 
            CAST(A.FY AS VARCHAR) AS FY, 
            CAST(A.Period AS VARCHAR) AS Period, 
            A.GLDesc AS Description, 
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,
            B.OUCode + ' - ' + B.OUDesc AS OU
        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE A.DocNum = @DocNo 
        AND B.OUCode + ' - ' + B.OUDesc = @OU`;
      break;

    case "Bank Payment":
      sqlCommand += `
        SELECT 
            FORMAT(A.GLDate, 'dd/MM/yyyy') AS JournalDate, 
            FORMAT(A.BankDueDate, 'dd/MM/yyyy') AS ClearanceDate, 
            A.GLDesc AS Description, 
            A.RefNo,
            C.Remarks AS Remarks,
            
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,
            
            NULL AS BankCode,

            D.PayTo, 
            D.TransferNo,
            B.OUCode + ' - ' + B.OUDesc AS OU,

            CAST(NULL AS VARCHAR) AS BeneficiaryInfo
            
        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN FIN_TransDet C ON A.TransHdrKey = C.TransHdrKey AND C.SeqNo = 0
        LEFT JOIN FIN_TransDetBC D ON A.TransHdrKey = D.TransHdrKey
        
        WHERE A.DocNum = @DocNo`;
      break;

      case "Bank Receipt":
      sqlCommand += `
        SELECT 
            FORMAT(A.GLDate, 'dd/MM/yyyy') AS JournalDate, 
            A.GLDesc AS Description, 
            A.RefNo,
            C.Remarks AS Remarks,
            
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,
            
            NULL AS BankCode,

            D.PayTo, 
            B.OUCode + ' - ' + B.OUDesc AS OU,

            CAST(NULL AS VARCHAR) AS BeneficiaryInfo
            
        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN FIN_TransDet C ON A.TransHdrKey = C.TransHdrKey AND C.SeqNo = 0
        LEFT JOIN FIN_TransDetBC D ON A.TransHdrKey = D.TransHdrKey
        
        WHERE A.DocNum = @DocNo`;
      break;

      case "Cash Payment":
      sqlCommand += `
        SELECT 
            FORMAT(A.GLDate, 'dd/MM/yyyy') AS JournalDate, 
            A.GLDesc AS Description, 
            A.RefNo,
            C.Remarks AS Remarks,
            
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,
            
            NULL AS CashCode,

            D.PayTo, 
            B.OUCode + ' - ' + B.OUDesc AS OU
            
        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN FIN_TransDet C ON A.TransHdrKey = C.TransHdrKey AND C.SeqNo = 0
        LEFT JOIN FIN_TransDetBC D ON A.TransHdrKey = D.TransHdrKey
        
        WHERE A.DocNum = @DocNo`;
      break;

      case "Cash Receipt":
      sqlCommand += `
        SELECT 
            FORMAT(A.GLDate, 'dd/MM/yyyy') AS JournalDate, 
            A.GLDesc AS Description, 
            A.RefNo,
            C.Remarks AS Remarks,
            
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,
            
            NULL AS CashCode,

            D.PayTo, 
            B.OUCode + ' - ' + B.OUDesc AS OU,

            CAST(NULL AS VARCHAR) AS ReceiveFrom
            
        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN FIN_TransDet C ON A.TransHdrKey = C.TransHdrKey AND C.SeqNo = 0
        LEFT JOIN FIN_TransDetBC D ON A.TransHdrKey = D.TransHdrKey
        
        WHERE A.DocNum = @DocNo`;
      break;

      case "Credit Note":
      sqlCommand += `
        SELECT 
            FORMAT(A.GLDate, 'dd/MM/yyyy') AS JournalDate, 
            A.GLDesc AS Description, 
            A.RefNo,
            C.Remarks AS Remarks,
            
            CASE A.Status
                WHEN 'AP' THEN 'APPROVED'
                WHEN 'OP' THEN 'OPEN'
                WHEN 'SM' THEN 'SUBMITTED'
                WHEN 'VD' THEN 'VOID'
            END AS Status,

            CASE A.CDType 
                WHEN 'GEN' THEN 'Credit Note (OR Debit Note received without Invoice)'
                WHEN 'SAL' THEN 'Sales Credit Note (OR Debit Note received from Cusotmer)' 
                WHEN 'PUR' THEN 'Purchase Credit Note (OR Debit Note received from Supplier)' 
            END AS CNType,

            B.OUCode + ' - ' + B.OUDesc AS OU,
            
            FORMAT(A.InvoiceDate, 'dd/MM/yyyy') AS InvoiceDate,
            FORMAT(A.DueDate, 'dd/MM/yyyy') AS DueDate,
            A.TaxInvNum AS TaxInvoice,
            
            NULL AS PayTerm,
            NULL AS Supplier,
            NULL AS SupplerAcc

        FROM FIN_TransHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN FIN_TransDet C ON A.TransHdrKey = C.TransHdrKey AND C.SeqNo = 0
        LEFT JOIN FIN_TransDetBC D ON A.TransHdrKey = D.TransHdrKey
        
        WHERE A.DocNum = @DocNo`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function accountGridSQLCommand(formName) {
  let sqlCommand = ""
  
  switch (formName) {
    case "General Journal":
      sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.DocNum = @DocNo 
        AND D.OUCode + ' - ' + D.OUDesc = @OU
        
        ORDER BY B.SeqNo ASC`;
      break;

      case "Closed Period Adjustment":
        sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.DocNum = @DocNo 
        AND D.OUCode + ' - ' + D.OUDesc = @OU
        
        ORDER BY B.SeqNo ASC`;
      break;

      case "Bank Payment":
      sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        
        WHERE A.DocNum = @DocNo   
        AND B.SeqNo > 0

        ORDER BY B.SeqNo ASC`;
      break;

      case "Bank Receipt":
      sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        
        WHERE A.DocNum = @DocNo   
        AND B.SeqNo > 0

        ORDER BY B.SeqNo ASC`;
      break;

      case "Cash Payment":
      sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        
        WHERE A.DocNum = @DocNo   
        AND B.SeqNo > 0

        ORDER BY B.SeqNo ASC`;
      break;

    case "Cash Receipt":
      sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        
        WHERE A.DocNum = @DocNo   
        AND B.SeqNo > 0

        ORDER BY B.SeqNo ASC`;
      break;

      case "Credit Note":
      sqlCommand += `
        SELECT 
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          B.UOM AS UOM,
          
          IIF(@region = 'IND',
            FORMAT(B.UnitPrice, 'N4', 'id-ID'),
            FORMAT(B.UnitPrice, 'N4', 'en-US')
          ) AS UnitPrice,

          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        
        WHERE A.DocNum = @DocNo   
        AND B.SeqNo > 0

        ORDER BY B.SeqNo ASC`;
      break;

      default:
        throw new Error(`Unknown formName: ${formName}`);
    }

  return sqlCommand;
}

module.exports = { accountSQLCommand, accountGridSQLCommand };