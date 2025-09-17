function procurementSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Purchase Requisition":
      sqlCommand = `
        SELECT FORMAT(A.PRDate, 'dd/MM/yyyy') AS RequestDate, 
        FORMAT(A.ExpectRDate, 'dd/MM/yyyy') AS ExpDelDate,
        A.Remarks,
        CASE
          WHEN A.LevelOfImportance = 1 THEN 'False'
          ELSE 'True
        END AS HighPrio,
        C.ItemID + ' - ' + C.ItemDesc,
        D.UOMCode + ' - ' + D.UOMDesc,
        B.ItemSpec,
        B.Qty AS RequestQty,
        B.Remarks AS Usage,
        B.EstimatedPrice AS UnitPrice,
        E.AccNum + ' - ' + E.AccDesc AS Account,
        F.CCIDCode + ' - ' + F.CCIDDesc AS CCID,
        G.OUCode + ' - ' + G.OUDesc AS OU
        FROM PROC_PRHdr A
        LEFT JOIN PROC_PRDet B ON A.PRKey = B.PRKey
        LEFT JOIN GMS_ItemMas C ON B.StoItemKey = C.StoItemKey
        LEFT JOIN GMS_UOMStp D ON B.UOMKey = D.UOMKey
        LEFT JOIN GMS_AccMas E ON B.NSExpAccKey = E.AccKey
        LEFT JOIN V_SYC_CCIDMapping F ON A.CCIDKey = F.CCIDKey
        LEFT JOIN GMS_OUStp G ON A.OUKey = G.OUKey
        WHERE PRNum = @DocNo`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}
