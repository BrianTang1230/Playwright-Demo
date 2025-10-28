function nurserySQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Pre Nursery Seed Received":
      sqlCommand = `
        SELECT FORMAT(A.RcvDate, 'dd/MM/yyyy') AS RcvDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        C.PlantSourceCode + ' - ' + C.PlantSourceDesc AS PlantSource,
        A.RefNo,
        A.OrdQty,
        A.DelQty,
        A.DamQty,
        A.FocQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_PRcv A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_PlantSourceStp C ON A.PlantSourceKey = C.PlantSourceKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.PRcvNum = @DocNo`;
      break;

    case "Pre Nursery Germinated":
      sqlCommand = `
        SELECT FORMAT(A.DbtDate, 'dd/MM/yyyy') AS DbtDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        C.PlantMateCode + ' - ' + C.PlantMateDesc AS PlantMaterial,
        A.SgtQty,
        A.DbtQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_PDoubleton A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_PlantMateStp C ON A.PlantMateKey = C.PlantMateKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.PDoubletonNum = @DocNo`;
      break;

    case "Pre Nursery Doubleton Splitting":
      sqlCommand = `
        SELECT FORMAT(A.PDbtSplitDate, 'dd/MM/yyyy') AS PDbtSplitDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        A.SplitQty,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM NUR_PDbtSplit A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.PDbtSplitNum = @DocNo`;
      break;

    case "Pre Nursery Culling":
      sqlCommand = `
        SELECT FORMAT(A.CullDate, 'dd/MM/yyyy') AS CullDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        A.PCullQty,
        A.PCullSTQty,
        A.PCullDTQty,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM NUR_PCull A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.PCullNum = @DocNo`;
      break;

    case "Pre Nursery Adjustment":
      sqlCommand = `
        SELECT FORMAT(A.AdjDate, 'dd/MM/yyyy') AS PAdjDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        A.NGQty,
        A.STQty,
        A.DTQty,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM NUR_PAdjustment A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.AdjNum = @DocNo`;
      break;

    case "Pre Nursery Transfer/Sold/Loss":
      sqlCommand = `
        SELECT FORMAT(A.TrnDate, 'dd/MM/yyyy') AS PreNurTransDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        C.PlantSourceCode + ' - ' + C.PlantSourceDesc AS PlantSource,
        CASE 
          WHEN A.TransTypeKey = 1 THEN 'Transfer to Batch'
          WHEN A.TransTypeKey = 2 THEN 'Transfer Out'
          WHEN A.TransTypeKey = 3 THEN 'Sold'
          ELSE 'Loss'
        END AS TransType,
        E.NurBatchCode + ' - ' + E.NurBatchDesc AS TrnToBatch,
        F.AccNum + ' - ' + F.AccDesc AS TrnOut,
        D.CCIDCode + ' - ' + D.CCIDDesc AS CCID,
        A.Remarks,
        A.TrnQty,
        A.DbtQty,
        G.OUCode + ' - ' + G.OUDesc AS OU
        FROM NUR_PTrn A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_PlantSourceStp C ON A.PlantSourceKey = C.PlantSourceKey
        LEFT JOIN V_SYC_CCIDMapping D ON A.CCIDKey = D.CCIDKey
        LEFT JOIN GMS_NurBatchStp E ON A.TrnToBatchKey = E.NurBatchKey
        LEFT JOIN GMS_AccMas F ON A.SoldToAccKey = F.AccKey
        LEFT JOIN GMS_OUStp G ON A.OUKey = G.OUKey
        WHERE A.PTrnNum = @DocNo`;
      break;

    case "Inter-OU Pre Nursery Transfer To":
      sqlCommand = `
        SELECT FORMAT(A.TrnDate, 'dd/MM/yyyy') AS InterTrnDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        CASE 
          WHEN A.TransTypeKey = 1 THEN 'Transfer to Batch'
          WHEN A.TransTypeKey = 2 THEN 'Transfer Out'
          END AS TransType,
        CASE
          WHEN A.IsToPre = 0 THEN 'Main Nursery'
          WHEN A.IsToPre = 1 THEN 'Pre Nursery'
          END AS NurType,
        C.PlantSourceCode + ' - ' + C.PlantSourceDesc AS PlantSource,
        I.PlantMateCode + ' - ' + I.PlantMateDesc AS PlantMaterial,
        F.AccNum + ' - ' + F.AccDesc AS Account,
        D.CCIDCode + ' - ' + D.CCIDDesc AS CCID,
        E.NurBatchCode + ' - ' + E.NurBatchDesc AS TrnToBatch,
        A.UnitPrice,
        A.Remarks,
        A.STQty,
        A.DTQty,
        G.OUCode + ' - ' + G.OUDesc AS FromOU,
        H.OUCode + ' - ' + H.OUDesc AS ToOU
        FROM NUR_PInterOUTrn A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_PlantSourceStp C ON A.PlantSourceKey = C.PlantSourceKey
        LEFT JOIN V_SYC_CCIDMapping D ON A.CCIDKey = D.CCIDKey
        LEFT JOIN GMS_NurBatchStp E ON A.ToNurBatchKey = E.NurBatchKey
        LEFT JOIN GMS_AccMas F ON A.AccKey = F.AccKey
        LEFT JOIN GMS_OUStp G ON A.FromOUKey = G.OUKey
        LEFT JOIN GMS_OUStp H ON A.ToOUKey = H.OUKey
        LEFT JOIN GMS_PlantMateStp I ON A.PlantMateKey = I.PlantMateKey
        WHERE A.IPTrnNum = @DocNo`;
      break;

    case "Main Nursery Received":
      sqlCommand = `
        SELECT FORMAT(A.MRcvDate, 'dd/MM/yyyy') AS MRcvDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        CASE
          WHEN A.MRcvInd = 'SUP' THEN 'Supplier'
          WHEN A.MRcvInd = 'OTH' THEN 'Other Batches/Parties'
          ELSE 'Pre-Nursery'
          END AS RcvFrm,
        C.PlantSourceCode + ' - ' + C.PlantSourceDesc AS PlantSource,
        A.RefNo,
        A.PreNTrnNo,
        A.SgtQty,
        A.DbtQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_MRcv A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_PlantSourceStp C ON A.PlantSourceKey = C.PlantSourceKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.MRcvNum = @DocNo`;
      break;

    case "Main Nursery Doubleton Splitting":
      sqlCommand = `
        SELECT FORMAT(A.MDbtSplitDate, 'dd/MM/yyyy') AS MDbtSplitDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        A.SplitQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_MDbtSplit A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.MDbtSplitNum = @DocNo`;
      break;

    case "Main Nursery Culling":
      sqlCommand = `
        SELECT FORMAT(A.CullDate, 'dd/MM/yyyy') AS MCullDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        A.CullQty AS SgtQty,
        A.MCullDTQty AS DbtQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_MainCull A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.NCNum = @DocNo`;
      break;

    case "Main Nursery Adjustment":
      sqlCommand = `
        SELECT FORMAT(A.AdjDate, 'dd/MM/yyyy') AS MAdjDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        A.STQty,
        A.DTQty,
        C.OUCode + ' - ' + C.OUDesc AS OU
        FROM NUR_MAdjustment A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
        WHERE A.AdjNum = @DocNo`;
      break;

    case "Main Nursery Transfer/Loss":
      sqlCommand = `
        SELECT FORMAT(A.MTrnDate,'dd/MM/yyyy') AS MTDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        CASE
          WHEN A.TransTypeKey = 1 THEN 'Transfer'
          ELSE 'Loss'
          END AS TransType,
        C.BlockCode + ' - ' + C.BlockDesc AS Block,
        E.AccNum + ' - ' + E.AccDesc AS Account,
        A.TrnQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_MTrn A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_BlockStp C ON A.BlockKey = C.BlockKey
        LEFT JOIN GMS_AccMas E ON A.AccKey = E.AccKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        WHERE A.MTrnNum = @DocNo`;
      break;

    case "Main Nursery Sold":
      sqlCommand = `
        SELECT FORMAT(A.SoldDate, 'dd/MM/yyyy') AS SoldDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        E.AccNum + ' - ' + E.AccDesc AS SoldToAccount,
        F.CCIDCode + ' - ' + F.CCIDDesc AS CCID,
        G.ContactCode + ' - ' + G.ContactDesc AS RefContact,
        A.SoldQty,
        D.OUCode + ' - ' + D.OUDesc AS OU
        FROM NUR_MSold A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
        LEFT JOIN GMS_AccMas E ON A.SoldToAccKey = E.AccKey
        LEFT JOIN V_SYC_CCIDMapping F ON A.CCIDKey = F.CCIDKey
        LEFT JOIN GMS_ContactStp G ON A.ContactKey = G.ContactKey
        WHERE A.MSoldNum = @DocNo`;
      break;

    case "Inter-OU Main Nursery Transfer To":
      sqlCommand = `
        SELECT FORMAT(A.TrnDate, 'dd/MM/yyyy') AS InterTrnDate,
        B.NurBatchCode + ' - ' + B.NurBatchDesc AS NurBatch,
        A.Remarks,
        CASE 
          WHEN A.TransTypeKey = 1 THEN 'Transfer to Batch'
          WHEN A.TransTypeKey = 2 THEN 'Transfer Out'
          END AS TransType,
        C.PlantSourceCode + ' - ' + C.PlantSourceDesc AS PlantSource,
        D.AccNum + ' - ' + D.AccDesc AS Account,
        E.CCIDCode + ' - ' + E.CCIDDesc AS CCID,
        F.NurBatchCode + ' - ' + F.NurBatchDesc AS TrnToBatch,
        A.UnitPrice,
        A.STQty,
        G.OUCode + ' - ' + G.OUDesc AS FromOU,
        H.OUCode + ' - ' + H.OUDesc AS ToOU
        FROM NUR_MInterOUTrn A
        LEFT JOIN GMS_NurBatchStp B ON A.NurBatchKey = B.NurBatchKey
        LEFT JOIN GMS_PlantSourceStp C ON A.PlantSourceKey = C.PlantSourceKey
        LEFT JOIN GMS_AccMas D ON A.AccKey = D.AccKey
        LEFT JOIN V_SYC_CCIDMapping E ON A.CCIDKey = E.CCIDKey
        LEFT JOIN GMS_NurBatchStp F ON A.ToNurBatchKey = F.NurBatchKey
        LEFT JOIN GMS_OUStp G ON A.FromOUKey = G.OUKey
        LEFT JOIN GMS_OUStp H ON A.ToOUKey = H.OUKey
        WHERE A.IMTrnNum = @DocNo`;
      break;

    case "Nursery Transfer Requisition":
      sqlCommand = `
          SELECT FORMAT(A.TransferDate, 'dd/MM/yyyy') AS TransferDate,
          A.Remark AS Remarks,
          A.ReferenceNum AS RefNo,
          C.OUCode + ' - ' + C.OUDesc AS ToOU,
          D.ContactCode + ' - ' + D.ContactDesc AS Contact,
          A.Price AS UnitPrice,
          A.Qty AS TransQty,
          FORMAT(A.ExpStartDeliveryDate, 'dd/MM/yyyy') AS ExpStartDate,
          FORMAT(A.ExpEndDeliveryDate, 'dd/MM/yyyy') AS ExpEndDate,
          CASE 
          WHEN A.Type = 1 THEN 'Pre Nursery'
          WHEN A.Type = 2 THEN 'Main Nursery'
          END AS NurType,
          E.PlantMateCode + ' - ' + E.PlantMateDesc AS PlantMaterial,
          B.OUCode + ' - ' + B.OUDesc AS OU
          FROM NUR_TransferHdr A
          LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
          LEFT JOIN GMS_OUStp C ON A.FromOUKey = C.OUKey
          LEFT JOIN GMS_ContactStp D ON A.ContactKey = D.ContactKey
          LEFT JOIN GMS_PlantMateStp E ON A.PlantMateKey = E.PlantMateKey
          WHERE A.TransferNum = @DocNo`;
      break;

    case "Nursery Sales Requisition":
      sqlCommand = `
          SELECT FORMAT(A.SoldDate, 'dd/MM/yyyy') AS SoldDate,
          A.Remark AS Remarks,
          A.ReferenceNum AS RefNo,
          B.ContactCode + ' - ' + B.ContactDesc AS Contact,
          A.Price AS UnitPrice,
          CASE 
            WHEN A.Type = 1 THEN 'Pre Nursery'
            WHEN A.Type = 2 THEN 'Main Nursery'
          END AS NurType,
          C.PlantMateCode + ' - ' + C.PlantMateDesc AS PlantMaterial,
          D.OUCode + ' - ' + D.OUDesc AS OU
          FROM NUR_SoldHdr A
          LEFT JOIN GMS_ContactStp B ON A.ContactKey = B.ContactKey
          LEFT JOIN GMS_PlantMateStp C ON A.PlantMateKey = C.PlantMateKey
          LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
          WHERE A.SoldNum = @DocNo`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function nurseryGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Nursery Sales Requisition":
      sqlCommand = `
       SELECT B.OUCode + ' - ' + B.OUDesc AS OU,
        A.Qty AS Quantity,
        FORMAT(A.ExpStartDeliveryDate, 'dd/MM/yyyy') AS ExpStartDate,
        FORMAT(A.ExpEndDeliveryDate, 'dd/MM/yyyy') AS ExpEndDate
        FROM NUR_SoldDet A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        WHERE SoldHdrKey IN(
        SELECT SoldHdrKey FROM NUR_SoldHdr
        WHERE SoldNum = @DocNo AND OUKey IN (
          SELECT OUKey FROM GMS_OUStp
            WHERE OUCode + ' - ' + OUDesc = @OU
          )
        )`;
      break;
    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { nurserySQLCommand, nurseryGridSQLCommand };
