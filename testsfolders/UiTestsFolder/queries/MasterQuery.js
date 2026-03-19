function masterSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Additional Remuneration Setup":
      sqlCommand = `
      SELECT AddRemCode,
      AddRemDesc,
      CASE Active 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
	    CASE Type 
        WHEN 'B' THEN 'Bonus/Incentive'
        WHEN 'A' THEN 'Arrears of salary or any other arrears paid to an employee' 
		    WHEN 'E' THEN 'Employee''s share option scheme'
        WHEN 'I' THEN 'Tax borne by employer' 
        WHEN 'G' THEN 'Gratuity' 
        WHEN 'P' THEN 'Compensation for loss of employment' 
		    WHEN 'X' THEN 'Ex-gratia'
        WHEN 'C' THEN 'Commissions'
        WHEN 'D' THEN 'Director''s fee (not paid monthly)'   
        WHEN 'O' THEN 'Others'
        WHEN 'BONUS' THEN 'Bonus'
        WHEN 'THR' THEN 'Holiday Allowance (THR)'
        WHEN 'RPD' THEN 'Arrears Income'
        WHEN 'COMPENS' THEN 'Compensation for loss of employment'
        WHEN 'COMM' THEN 'Commissions'
        WHEN 'DIRFEE' THEN 'Director''s fee'
        WHEN 'OTH' THEN 'Others'
      END AS RemType,
      CASE IsPrevYr 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      End AS IsPrevYr,
      CASE EnableTax 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      End AS PCB,
      CASE EnableEPF 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      End AS EPF,
      CASE EnableSOCSO 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      End AS SOCSO,
      CASE EnableEIS 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      End AS EIS,
      CASE EnableHRDF 
        WHEN 1 THEN 'True' 
        WHEN 0 THEN 'False'
      End AS HRDF
      FROM GMS_AddRemStp  
      WHERE AddRemCode = @Code
      `;
      break;

    case "Allowance/Deduction/Reimbursement Group Setup":
      sqlCommand = `
      SELECT GrpCode,
      GrpDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
      END AS RcdType,
      CASE GrpType
        WHEN 'A' THEN 'Allowance'
        WHEN 'D' THEN 'Deduction'
        WHEN 'R' THEN 'Reimbursement'
        WHEN 'T' THEN 'Additional Tax Deduction'
        WHEN 'S' THEN 'Overpaid Salary/Unpaid Leave'
      END AS Type
      FROM GMS_PayGrpCodeStp
      WHERE GrpCode = @Code
      `;
      break;

    case "Certification Setup":
      sqlCommand = `
      SELECT A.CertCode,
      A.CertDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
		    WHEN 1 THEN 'System'
      END AS RcdType,
      A.CertNo,
      CASE A.IsDefault
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsDefault,
      CASE A.IsCV
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Conventional,
      FORMAT(A.CertExpiryDate, 'dd/MM/yyyy') AS ExpiryDate,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_CertStp A
	    LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE CertCode = @Code
	    AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case "Contact Category Setup":
      sqlCommand = `
        SELECT ContactCatCode, 
        ContactCatDesc, 
        CASE Active
          WHEN 1 THEN 'True' 
          WHEN 0 THEN 'False'
        END AS Active,
        CASE RcdType
          WHEN 0 THEN 'User'
          WHEN 1 THEN 'System'
        END AS RcdType,
        CASE IsCropSupp
          WHEN 1 THEN 'True' 
          WHEN 0 THEN 'False'
        END AS CropSupp
        FROM GMS_ContactCategoryStp 
        WHERE ContactCatCode = @Code`;
      break;

    case "Country Setup":
      sqlCommand = `
        SELECT CtryCode, 
        CtryDesc, 
        CASE Active 
          WHEN 1 THEN 'True' 
          WHEN 0 THEN 'False'
        END AS Active,
        CASE RcdType
          WHEN 0 THEN 'User'
          WHEN 1 THEN 'System'
        END AS RcdType
        FROM GMS_CountryStp 
        WHERE CtryCode = @Code`;
      break;

    case "Currency Setup":
      sqlCommand = `
        SELECT CurrCode, 
        CurrDesc, 
        CASE Active
          WHEN 1 THEN 'True' 
          WHEN 0 THEN 'False'
        END AS Active,
        CASE RcdType
          WHEN 0 THEN 'User'
          WHEN 1 THEN 'System'
        END AS RcdType,
        CurrSymb
        FROM GMS_CurrencyStp 
        WHERE CurrCode = @Code
      `;
      break;

    case "Division Setup":
      sqlCommand = `
      SELECT A.DivCode,
      A.DivDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_DivStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.DivCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function masterGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Additional Remuneration Setup":
      sqlCommand = `
      SELECT C.OUCode + ' - ' + C.OUDesc AS OU,  
      D.AccNum + ' - ' + D.AccDesc AS Account,
      CASE WHEN E.CCIDKey = -1 THEN 'NA' ELSE E.CCIDCode + ' - ' + E.CCIDDesc END AS CCID
      FROM dbo.GMS_AddRemStp A  
      LEFT JOIN GMS_AddRemOUStp B ON A.AddRemKey = B.AddRemKey  
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey  
      LEFT JOIN GMS_AccMas D ON  B.AccKey = D.AccKey  
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = B.CCIDKey  
      WHERE A.AddRemCode = @Code `;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = {
  masterSQLCommand,
  masterGridSQLCommand,
};
