function cmSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Job Order":
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

export { cmSQLCommand };