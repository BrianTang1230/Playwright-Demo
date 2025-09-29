function procurementSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Purchase Requisition":
      sqlCommand = `
        SELECT FORMAT(A.PRDate, 'dd/MM/yyyy') AS RequestDate, 
        FORMAT(A.ExpectRDate, 'dd/MM/yyyy') AS ExpDelDate,
        A.Remarks,
        C.ItemID + ' - ' + C.ItemDesc AS Item,
        D.UOMCode + ' - ' + D.UOMDesc AS UOM,
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
        LEFT JOIN V_SYC_CCIDMapping F ON B.CCIDKey = F.CCIDKey
        LEFT JOIN GMS_OUStp G ON A.OUKey = G.OUKey
        WHERE PRNum = @DocNo`;
      break;

    case "Request for Quotation":
      sqlCommand = `
        SELECT FORMAT(A.QRFDate, 'dd/MM/yyyy') AS QRFDate, 
        B.ContactCode + ' - ' + B.ContactDesc AS Supplier,
        A.Remarks,
        CASE
          WHEN A.WithPR = 1 THEN 'True'
          ELSE 'False'
        END AS WithPR,
        CASE
          WHEN A.PRKey > 0 THEN C.PRNum
          ELSE 'NA'
        END AS PRNum,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM QUOT_QRFHdr A
        LEFT JOIN GMS_ContactStp B ON A.ContactKey = B.ContactKey
        LEFT JOIN PROC_PRHdr C ON A.PRKey = C.PRKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE QRFNum = @DocNo`;
      break;

    case "Purchase Order":
      sqlCommand = `
        SELECT FORMAT(A.PODate, 'dd/MM/yyyy') AS PODate,
        FORMAT(A.DeliveryDate, 'dd/MM/yyyy') AS DeliveryDate,
        B.ContactCode + ' - ' + B.ContactDesc AS Supplier,
        A.TextTaxes AS Tax,
        A.QfG AS Qfg,
        A.LoFr AS Loco,
        A.TextRef AS Reference,
        A.TransporterName AS Transporter,
        A.Remarks,
        CASE
          WHEN C.WithPR = 1 THEN 'True'
          ELSE 'False'
        END AS WithPR,
        CASE
          WHEN C.WithPR > 0 THEN D.PRNum
          ELSE 'NA'
        END AS PRNum,
        F.ItemID + ' - ' + F.ItemDesc AS Item,
        E.ItemSpec AS ItemSpec,
        C.OrderQty AS Qty,
        G.UOMCode AS UOM,
        C.UnitCost AS UnitPrice,
        C.DisPer AS Discount,
        H.AccNum + ' - ' + H.AccDesc AS ChargeAcc,
        I.CCIDCode + ' - ' + I.CCIDDesc AS ChargeCCID,
        C.VendRef AS VendRef,
        C.VendItemDesc AS VendDesc,
        FROM PROC_POHdr A
        LEFT JOIN GMS_ContactStp B ON A.Supplier = B.ContactKey
        LEFT JOIN PROC_PODet C ON A.POKey = C.POKey
        LEFT JOIN PROC_PRHdr D ON C.PRKey = D.PRKey
        LEFT JOIN PROC_PRDet E ON C.PRItemKey = E.PRItemKey
        LEFT JOIN GMS_ItemMas F ON E.StoItemKey = F.StoItemKey
        LEFT JOIN GMS_UOMStp G ON C.UOMKey = G.UOMKey
        LEFT JOIN GMS_AccMas H ON C.NSExpAccKey = H.AccKey
        LEFT JOIN V_SYC_CCIDMapping I ON C.CCIDKey = I.CCIDKey
        WHERE PONum = @DocNo`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function procurementGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Request for Quotation":
      sqlCommand = `
        SELECT B.ItemID + ' - ' + B.ItemDesc AS Item,
        A.ItemSpecs,
        A.Qty AS Qtynumeric,
        A.UnitPrice,
        C.UOMCode AS UOM,
        CASE
          WHEN A.IsRecommended = 1 THEN 'True'
          ELSE 'False'
        END AS IsRecommended,
        A.Remarks
        FROM QUOT_QRFDet A
        LEFT JOIN GMS_ItemMas B ON A. ItemKey = B.StoItemKey
        LEFT JOIN GMS_UOMStp C ON A.UOMKey = C.UOMKey
        WHERE QRFHdrKey IN (
          SELECT QRFHdrKey FROM QUOT_QRFHdr WHERE QRFNum = @DocNo
        )`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { procurementSQLCommand, procurementGridSQLCommand };
