function labSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Crude Palm Oil Quality (FFA)":
      sqlCommand = `
        SELECT FORMAT(A.CPOFFADate, 'dd/MM/yyyy') AS CPOFFADate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_CPOQltyFFAHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_CPOQltyFFADet C ON C.CPOFFAHdrKey = A.CPOFFAHdrKey
        WHERE FORMAT(A.CPOFFADate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function labGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Crude Palm Oil Quality (FFA)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumerice,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Flask AS Fnumeric,
        A.FlaskAndOil AS FOnumeric,
        A.VolNaOH AS VNnumeric,
        A.NaOHNormal AS NNnumeric
        FROM LAB_CPOQltyFFADet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.CPOFFAHdrKey IN (
          SELECT H.CPOFFAHdrKey
          FROM LAB_CPOQltyFFAHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.CPOFFADate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = {
  labSQLCommand,
  labGridSQLCommand,
};
