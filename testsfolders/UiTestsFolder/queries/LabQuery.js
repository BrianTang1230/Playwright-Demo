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

    case "Crude Palm Oil Quality (Moisture)":
      sqlCommand = `
        SELECT FORMAT(A.CPOMoistDate, 'dd/MM/yyyy') AS CPOMoistDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_CPOQltyMoistHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_CPOQltyMoistDet C ON C.CPOMoistHdrKey = A.CPOMoistHdrKey
        WHERE FORMAT(A.CPOMoistDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Crude Palm Oil Quality (Impurities)":
      sqlCommand = `
        SELECT FORMAT(A.CPOImpDate, 'dd/MM/yyyy') AS CPOImpDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_CPOQltyImpHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_CPOQltyImpDet C ON C.CPOImpHdrKey = A.CPOImpHdrKey
        WHERE FORMAT(A.CPOImpDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Crude Palm Oil Quality (DOBI)":
      sqlCommand = `
        SELECT FORMAT(A.CPODOBIDate, 'dd/MM/yyyy') AS CPODOBIDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_CPOQltyDOBIHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_CPOQltyDOBIDet C ON C.CPODOBIHdrKey = A.CPODOBIHdrKey
        WHERE FORMAT(A.CPODOBIDate, 'dd/MM/yyyy') = @Date
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

    case "Crude Palm Oil Quality (Moisture)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumerice,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Beaker AS Bnumeric,
        A.BeakerAndSamp AS BSOnumeric,
        A.BeakerAndDSamp AS BDSnumeric
        FROM LAB_CPOQltyMoistDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.CPOMoistHdrKey IN (
          SELECT H.CPOMoistHdrKey
          FROM LAB_CPOQltyMoistHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.CPOMoistDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Crude Palm Oil Quality (Impurities)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumerice,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.Crucible AS Cnumeric,
        A.CrucibleDirt AS CDnumeric
        FROM LAB_CPOQltyImpDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.CPOImpHdrKey IN (
          SELECT H.CPOImpHdrKey
          FROM LAB_CPOQltyImpHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.CPOImpDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Crude Palm Oil Quality (DOBI)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumerice,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.Blanknm269 AS B2numeric,
        A.Blanknm446 AS B4numeric,
        A.nm269 AS O2numeric,
        A.nm446 AS O4numeric
        FROM LAB_CPOQltyDOBIDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.CPODOBIHdrKey IN (
          SELECT H.CPODOBIHdrKey
          FROM LAB_CPOQltyDOBIHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.CPODOBIDate, 'dd/MM/yyyy') = @Date
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
