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

    case "Kernel Quality (Kernel Dirt)":
      sqlCommand = `
        SELECT FORMAT(A.PKDirtDate, 'dd/MM/yyyy') AS PKDirtDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PKQltyDirtHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PKQltyDirtDet C ON C.PKDirtHdrKey = A.PKDirtHdrKey
        WHERE FORMAT(A.PKDirtDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Kernel Quality (FFA)":
      sqlCommand = `
        SELECT FORMAT(A.PKFFADate, 'dd/MM/yyyy') AS PKFFADate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PKQltyFFAHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PKQltyFFADet C ON C.PKFFAHdrKey = A.PKFFAHdrKey
        WHERE FORMAT(A.PKFFADate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Kernel Quality (Moisture & Oil Content)":
      sqlCommand = `
        SELECT FORMAT(A.PKMoistDate, 'dd/MM/yyyy') AS PKMoistDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PKQltyMoistHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PKQltyMoistDet C ON C.PKMoistHdrKey = A.PKMoistHdrKey
        WHERE FORMAT(A.PKMoistDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Oil Losses":
      sqlCommand = `
        SELECT FORMAT(A.FibreLossDate, 'dd/MM/yyyy') AS FibreLossDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_FibreLossHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_FibreLossDet C ON C.FibreLossHdrKey = A.FibreLossHdrKey
        WHERE FORMAT(A.FibreLossDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Sludge Waste Losses":
      sqlCommand = `
        SELECT FORMAT(A.SludgeWasteDate, 'dd/MM/yyyy') AS SludgeWasteDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_SludgeWasteHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_SludgeWasteDet C ON C.SludgeWasteHdrKey = A.SludgeWasteHdrKey
        WHERE FORMAT(A.SludgeWasteDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Kernel Losses":
      sqlCommand = `
        SELECT FORMAT(A.KernelLossDate, 'dd/MM/yyyy') AS KernelLossDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_KernelLossHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_KernelLossDet C ON C.KernelLossHdrKey = A.KernelLossHdrKey
        WHERE FORMAT(A.KernelLossDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Cracking Efficiency":
      sqlCommand = `
        SELECT FORMAT(A.CrackEffDate, 'dd/MM/yyyy') AS CrackEffDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_CrackEffHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_CrackEffDet C ON C.CrackEffHdrKey = A.CrackEffHdrKey
        WHERE FORMAT(A.CrackEffDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Water Quality":
      sqlCommand = `
        SELECT FORMAT(A.WaterQltyDate, 'dd/MM/yyyy') AS WaterQltyDate,
        A.Rainfall,
        A.PondWaterLvl,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_WaterQltyHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_WaterQltyDet C ON C.WaterQltyHdrKey = A.WaterQltyHdrKey
        WHERE FORMAT(A.WaterQltyDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Effluent Test":
      sqlCommand = `
        SELECT FORMAT(A.EffluentDate, 'dd/MM/yyyy') AS EffluentDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_EffluentHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_EffluentDet C ON C.EffluentHdrKey = A.EffluentHdrKey
        WHERE FORMAT(A.EffluentDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Effluent Flowmeter Reading":
      sqlCommand = `
        SELECT FORMAT(A.EfflFlowmeterDate, 'dd/MM/yyyy') AS EfflFlowmeterDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_EfflFlowmeterHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_EfflFlowmeterDet C ON C.EfflFlowmeterHdrKey = A.EfflFlowmeterHdrKey
        WHERE FORMAT(A.EfflFlowmeterDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Press Cake":
      sqlCommand = `
        SELECT FORMAT(A.PressCakeDate, 'dd/MM/yyyy') AS PressCakeDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PressCakeHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PressCakeDet C ON C.PressCakeHdrKey = A.PressCakeHdrKey
        WHERE FORMAT(A.PressCakeDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Press Cake MPD":
      sqlCommand = `
        SELECT FORMAT(A.PressCakeMPDDate, 'dd/MM/yyyy') AS PressCakeMPDDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PressCakeMPDHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PressCakeMPDDet C ON C.PressCakeMPDHdrKey = A.PressCakeMPDHdrKey
        WHERE FORMAT(A.PressCakeMPDDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Press Cake Nut Composition":
      sqlCommand = `
        SELECT FORMAT(A.PressCakeNCDate, 'dd/MM/yyyy') AS PressCakeNCDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PressCakeNCHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PressCakeNCDuraDet C ON C.PressCakeNCHdrKey = A.PressCakeNCHdrKey
        WHERE FORMAT(A.PressCakeNCDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Press Cake Dried Nut Moisture":
      sqlCommand = `
        SELECT FORMAT(A.PressCakeDNMoistDate, 'dd/MM/yyyy') AS PressCakeDNMoistDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_PressCakeDNMoistHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_PressCakeDNMoistDet C ON C.PressCakeDNMoistHdrKey = A.PressCakeDNMoistHdrKey
        WHERE FORMAT(A.PressCakeDNMoistDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Losses in Empty Fruit Bunches":
      sqlCommand = `
        SELECT FORMAT(A.EFBLossDate, 'dd/MM/yyyy') AS EFBLossDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_EFBLossHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_EFBLossDet C ON C.EFBLossHdrKey = A.EFBLossHdrKey
        WHERE FORMAT(A.EFBLossDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Spin Test":
      sqlCommand = `
        SELECT FORMAT(A.SpinTestDate, 'dd/MM/yyyy') AS SpinTestDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_SpinTestHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_SpinTestDet C ON C.SpinTestHdrKey = A.SpinTestHdrKey
        WHERE FORMAT(A.SpinTestDate, 'dd/MM/yyyy') = @Date
          AND B.OUCode + ' - ' + B.OUDesc = @OU
          AND C.Num IN (6666,9999)`;
      break;

    case "Chemical Dosage":
      sqlCommand = `
        SELECT FORMAT(A.ChemicalDosDate, 'dd/MM/yyyy') AS ChemicalDosDate,
        B.OUCode + ' - ' + B.OUDesc AS OU
        FROM LAB_ChemicalDosHdr A
        LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
        LEFT JOIN LAB_ChemicalDosDet C ON C.ChemicalDosHdrKey = A.ChemicalDosHdrKey
        WHERE FORMAT(A.ChemicalDosDate, 'dd/MM/yyyy') = @Date
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
        A.Num AS Numnumeric,
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
        A.Num AS Numnumeric,
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
        A.Num AS Numnumeric,
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
        A.Num AS Numnumeric,
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

    case "Kernel Quality (Kernel Dirt)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.WN AS WNnumeric,
        A.HCN AS HCNnumeric,
        A.WK AS WKnumeric,
        A.BK AS BKnumeric,
        A.FreeShell AS FSnumeric,
        A.Stone AS Stnumeric
        FROM LAB_PKQltyDirtDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.PKDirtHdrKey IN (
          SELECT H.PKDirtHdrKey
          FROM LAB_PKQltyDirtHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PKDirtDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Kernel Quality (FFA)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Flask AS Fnumeric,
        A.FlaskAndOil AS FOnumeric,
        A.VolNaOH AS VNnumeric,
        A.NaOHNormal AS NNnumeric
        FROM LAB_PKQltyFFADet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.PKFFAHdrKey IN (
          SELECT H.PKFFAHdrKey
          FROM LAB_PKQltyFFAHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PKFFADate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Kernel Quality (Moisture & Oil Content)":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Dish AS Dnumeric,
        A.DishAndKernel AS DKnumeric,
        A.DishAndDKernel AS DDKnumeric,
        A.Flask AS Fnumeric,
        A.FlaskAndDSample AS FDSnumeric
        FROM LAB_PKQltyMoistDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.PKMoistHdrKey IN (
          SELECT H.PKMoistHdrKey
          FROM LAB_PKQltyMoistHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PKMoistDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Oil Losses":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Beaker AS Bnumeric,
        A.BeakerAndSample AS BSnumeric,
        A.BeakerAndDSample AS BDSnumeric,
        A.Flask AS Fnumeric,
        A.FlaskAndDSample AS FDSnumeric
        FROM LAB_FibreLossDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.FibreLossHdrKey IN (
          SELECT H.FibreLossHdrKey
          FROM LAB_FibreLossHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.FibreLossDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Sludge Waste Losses":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Beaker AS Bnumeric,
        A.BeakerAndSample AS BSnumeric,
        A.BeakerAndDSample AS BDSnumeric,
        A.Flask AS Fnumeric,
        A.FlaskAndDSample AS FDSnumeric
        FROM LAB_SludgeWasteDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.SludgeWasteHdrKey IN (
          SELECT H.SludgeWasteHdrKey
          FROM LAB_SludgeWasteHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.SludgeWasteDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Kernel Losses":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.SampleWeight AS SWnumeric,
        A.UncrackNut AS WNnumeric,
        A.SmallNut AS SNnumeric,
        A.HalfCrackNut AS HCNnumeric,
        A.WholeKernel AS WKnumeric,
        A.BrokenKernel AS BKnumeric
        FROM LAB_KernelLossDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.KernelLossHdrKey IN (
          SELECT H.KernelLossHdrKey
          FROM LAB_KernelLossHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.KernelLossDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Cracking Efficiency":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.SampleAfter AS Snumeric,
        A.WNAfter AS WNnumeric,
        A.HCNAfter AS HCNnumeric,
        A.WKAfter AS WKnumeric,
        A.BKAfter AS BKnumeric,
        A.FreeShellAfter AS FSnumeric
        FROM LAB_CrackEffDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.CrackEffHdrKey IN (
          SELECT H.CrackEffHdrKey
          FROM LAB_CrackEffHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.CrackEffDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Water Quality":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.PH AS PHnumeric,
        A.TDS AS TDSnumeric,
        A.Hardness AS Hnumeric,
        A.PAlkal AS PAnumeric,
        A.MAlkal AS MAnumeric,
        A.CAlkal AS CAnumeric,
        A.Phosphate AS Pnumeric,
        A.Silica AS Snumeric,
        A.Sulphite AS Sunumeric
        FROM LAB_WaterQltyDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.WaterQltyHdrKey IN (
          SELECT H.WaterQltyHdrKey
          FROM LAB_WaterQltyHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.WaterQltyDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Effluent Test":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.PH AS PHnumeric,
        A.BioOxy AS BOnumeric,
        A.ChemOxy AS COnumeric,
        A.Nitrogen AS Nnumeric,
        A.AmmoNitro AS ANnumeric,
        A.Solid AS Snumeric,
        A.Susolid AS SSnumeric,
        A.OilGrease AS OGnumeric
        FROM LAB_EffluentDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.EffluentHdrKey IN (
          SELECT H.EffluentHdrKey
          FROM LAB_EffluentHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.EffluentDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Effluent Flowmeter Reading":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Reading AS Rnumeric
        FROM LAB_EfflFlowmeterDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.EfflFlowmeterHdrKey IN (
          SELECT H.EfflFlowmeterHdrKey
          FROM LAB_EfflFlowmeterHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.EfflFlowmeterDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Press Cake":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.WN AS WNnumeric,
        A.HCN AS HCNnumeric,
        A.WK AS WKnumeric,
        A.BK AS BKnumeric,
        A.FreeShell AS FreeShell
        FROM LAB_PressCakeDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.PressCakeHdrKey IN (
          SELECT H.PressCakeHdrKey
          FROM LAB_PressCakeHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PressCakeDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Press Cake MPD":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.Mesocarp AS Mnumeric,
        A.Nut AS Nnumeric,
        A.NParthencarp AS NPnumeric,
        A.AbParthencarp AS APnumeric,
        A.Thrash AS Tnumeric,
        A.Yellowish AS Ynumeric,
        A.Reddish AS Rnumeric
        FROM LAB_PressCakeMPDDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.PressCakeMPDHdrKey IN (
          SELECT H.PressCakeMPDHdrKey
          FROM LAB_PressCakeMPDHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PressCakeMPDDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Press Cake Nut Composition":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.Dura AS Dnumeric,
        A.Tenera AS Tnumeric,
        D.TypeIDCode + ' - ' + D.TypeIDDesc AS KTypeID,
        C.Num AS KNumnumeric,
        CONVERT(varchar(5), C.Time, 108) AS KTime,
        C.Sample AS KSnumeric,
        C.Kernel AS Knumeric,
        C.Shell AS Shnumeric
        FROM LAB_PressCakeNCDuraDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey
        LEFT JOIN LAB_PressCakeNCKernelDet C ON A.PressCakeNCHdrKey = C.PressCakeNCHdrKey
        LEFT JOIN GMS_TypeIDStp D ON C.TypeIDKey = D.TypeIDKey
        WHERE A.Num IN (6666,9999)
        AND A.PressCakeNCHdrKey IN (
          SELECT H.PressCakeNCHdrKey
          FROM LAB_PressCakeNCHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PressCakeNCDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Press Cake Dried Nut Moisture":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Beaker AS Bnumeric,
        A.BeakerAndSamp AS BSnumeric,
        A.BeakerAndDSamp AS BDSnumeric
        FROM LAB_PressCakeDNMoistDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.PressCakeDNMoistHdrKey IN (
          SELECT H.PressCakeDNMoistHdrKey
          FROM LAB_PressCakeDNMoistHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.PressCakeDNMoistDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Losses in Empty Fruit Bunches":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Beaker AS Bnumeric,
        A.BeakerAndSample AS BSnumeric,
        A.BeakerAndDSample AS BDSnumeric,
        A.Flask AS Fnumeric,
        A.FlaskAndDSample AS FDSnumeric
        FROM LAB_EFBLossDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.EFBLossHdrKey IN (
          SELECT H.EFBLossHdrKey
          FROM LAB_EFBLossHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.EFBLossDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Spin Test":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        A.Sample AS Snumeric,
        A.Oil AS Onumeric,
        A.Water AS Wnumeric,
        A.Sludge AS SDnumeric,
        A.FRate AS FRnumeric,
        A.Temperature AS Tnumeric
        FROM LAB_SpinTestDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey 
        WHERE A.Num IN (6666,9999)
        AND A.SpinTestHdrKey IN (
          SELECT H.SpinTestHdrKey
          FROM LAB_SpinTestHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.SpinTestDate, 'dd/MM/yyyy') = @Date
            AND G.OUCode + ' - ' + G.OUDesc = @OU
        )`;
      break;

    case "Chemical Dosage":
      sqlCommand = `
        SELECT B.TypeIDCode + ' - ' + B.TypeIDDesc AS TypeID,
        A.Num AS Numnumeric,
        CONVERT(varchar(5), A.Time, 108) AS Time,
        C.ChemCode + ' - ' + C.ChemDesc,
        A.Amount AS Anumeric
        FROM LAB_ChemicalDosDet A  
        LEFT JOIN GMS_TypeIDStp B ON A.TypeIDKey = B.TypeIDKey
        LEFT JOIN GMS_ChemStp  C ON A.ChemKey = C.ChemKey
        WHERE A.Num IN (6666,9999)  
        AND A.ChemicalDosHdrKey IN (
          SELECT H.ChemicalDosHdrKey
          FROM LAB_ChemicalDosHdr H
          LEFT JOIN GMS_OUStp G ON H.OUKey = G.OUKey
          WHERE FORMAT(H.ChemicalDosDate, 'dd/MM/yyyy') = @Date
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
