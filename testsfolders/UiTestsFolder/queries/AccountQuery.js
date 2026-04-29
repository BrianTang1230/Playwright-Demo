import Login from "@utils/data/uidata/loginData.json";
const region = process.env.REGION || Login.Region;

function accountSQLCommand(formName) {
  let sqlCommand = `
   DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
         THEN 'TSPE - TANI SEJAHTERA PERKASA ESTATE'
         ELSE 'BNG - BINUANG ESTATE'
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
          -- 1. Concatenate the codes and descriptions
          C.AccNum + ' - ' + C.AccDesc AS Account, 
          E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
          B.Remarks AS Remarks,
          B.Qty AS Qtynumeric,
          
          -- If OrigTransAmt is positive, put it in Debit. Otherwise, 0.
          CASE WHEN B.OrigTransAmt > 0 THEN B.OrigTransAmt ELSE 0 END AS Debitnumeric,
          
          -- If OrigTransAmt is negative, make it positive (ABS) and put it in Credit. Otherwise, 0.
          CASE WHEN B.OrigTransAmt < 0 THEN ABS(B.OrigTransAmt) ELSE 0 END AS Creditnumeric
          
        FROM FIN_TransDet B
        LEFT JOIN FIN_TransHdr A ON B.TransHdrKey = A.TransHdrKey
        LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
        
        -- Note: Join CCIDMapping based on the string code since your DB shows 'BW01'
        LEFT JOIN V_SYC_CCIDMapping E ON B.CCID = E.CCIDCode 
        
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.DocNum = @DocNo 
        AND D.OUCode + ' - ' + D.OUDesc = @OU
        
        -- 3. Force the rows to match the UI order
        ORDER BY B.SeqNo ASC`;
      break;

      default:
        throw new Error(`Unknown formName: ${formName}`);
    }

  return sqlCommand;
}

module.exports = { accountSQLCommand, accountGridSQLCommand };