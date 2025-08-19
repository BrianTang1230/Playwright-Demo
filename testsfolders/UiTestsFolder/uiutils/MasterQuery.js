function masterSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Country Setup":
      sqlCommand = `
        SELECT CtryCode, 
               CtryDesc, 
               CASE WHEN Active = 1 THEN 'True' WHEN Active = 0 THEN 'False' END AS Active
        FROM "GMS_CountryStp" 
        WHERE CtryCode = @Code`;
      break;

    case "Additional Remuneration Setup":
      sqlCommand = `SELECT AddRemCode, AddRemDesc,  
                  CASE WHEN Active = 1 THEN 'True' WHEN Active = 0 THEN 'False' END AS 'Active',  
                  CASE WHEN Type = 'A' THEN 'Arrears of salary or any other arrears paid to an employee' WHEN Type = 'B' THEN 'Bonus/Incentive' WHEN Type = 'C' THEN 'Commissions'  
                  WHEN Type = 'G' THEN 'Gratuity' WHEN Type = 'P' THEN 'Compensation for loss of employment' WHEN Type = 'D' THEN 'Director''s fee (not paid monthly)'  
                  WHEN Type = 'I' THEN 'Tax borne by employer' WHEN Type = 'RPD' THEN 'Arrears Income' WHEN Type = 'COMPENS' THEN 'Compensation for loss of employment' WHEN Type = 'O' THEN 'Others' END AS 'RemType',  
                  CASE WHEN IsPrevYr = 1 THEN 'True' WHEN IsPrevYr = 0 THEN 'False' End AS 'IsPrevYr',  
                  CASE WHEN EnableTax = 1 THEN 'True' WHEN EnableTax = 0 THEN 'False' End AS 'PCB',  
                  CASE WHEN EnableEPF = 1 THEN 'True' WHEN EnableEPF = 0 THEN 'False' End AS 'EPF',  
                  CASE WHEN EnableSOCSO = 1 THEN 'True' WHEN EnableSOCSO = 0 THEN 'False' End AS 'SOCSO',  
                  CASE WHEN EnableEIS = 1 THEN 'True' WHEN EnableEIS = 0 THEN 'False' End AS 'EIS',  
                  CASE WHEN EnableHRDF = 1 THEN 'True' WHEN EnableHRDF = 0 THEN 'False' End AS 'HRDF'  
                  FROM GMS_AddRemStp  
                  WHERE AddRemCode = @Code`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function masterGridSqlCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Additional Remuneration Setup":
      sqlCommand = `SELECT C.OUCode + ' - ' + C.OUDesc AS OU,  
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
  masterGridSqlCommand,
};
