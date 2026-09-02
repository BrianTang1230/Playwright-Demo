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

    case "Field Setup":
      sqlCommand = `
      select A.FieldCode,
      A.FieldDesc,
      CASE A.Active
        WHen 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      C.DivCode + ' - ' + C.DivDesc as Division,
      B.OUCode + ' - ' + B.OUDesc as OU
      FROM GMS_FieldStp A
      LEFT JOIN GMS_OUStp B ON B.OUKey = A.OUKey
      LEFT JOIN GMS_DivStp C ON C.DivKey = A.DivKey
      WHERE A.FieldCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case "Location Setup":
      sqlCommand = `
      select A.LocationCode,
      A.LocationDesc,
      CASE A.Active
        WHen 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.IsDefault
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsDefault,
      B.OUCode + ' - ' + B.OUDesc AS OU,
      A.Address,
      A.ContactPerson as Contact,
      C.PostDesc,
      A.Phone,
      A.Mobile,
      A.Fax,
      A.Email
      FROM GMS_LocationStp A
      LEFT JOIN GMS_OUStp B ON B.OUKey = A.OUKey
      LEFT JOIN GMS_PostStp C ON C.PostKey = A.Position
      WHERE A.LocationCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case "Nationality Setup":
      sqlCommand = `
      select A.NationalityCode,
      A.NationalityDesc,
      CASE A.Active
        WHen 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 1 THEN 'System'
        WHEN 0 THEN 'User'
      END AS RcdType,
      B.CtryCode + ' - ' + B.CtryDesc AS Country
      FROM GMS_NationalStp A
      LEFT JOIN GMS_CountryStp B ON B.CtryKey = A.CtryKey
      WHERE A.NationalityCode = @Code
      `;
      break;

    case "Planting Source Setup":
      sqlCommand = `
      SELECT PlantSourceCode,
      PlantSourceDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_PlantSourceStp
      WHERE PlantSourceCode = @Code
      `;
      break;

    case "Planting Material Setup":
      sqlCommand = `
      SELECT PlantMateCode,
      PlantMateDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_PlantMateStp
      WHERE PlantMateCode = @Code
      `;
      break;

    case "Position Type Setup":
      sqlCommand = `
      SELECT PostTypeCode,
      PostTypeDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_PostTypeStp
      WHERE PostTypeCode = @Code
      `;
      break;
    
    case "Race Setup":
      sqlCommand = `
      SELECT RaceCode,
      RaceDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_RaceStp
      WHERE RaceCode = @Code
      `;
      break;

    case "Soil Type Setup":
      sqlCommand = `
      SELECT SoilTypeCode,
      SoilTypeDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_SoilTypeStp
      WHERE SoilTypeCode = @Code
      `;
      break;

    case "State Setup":
      sqlCommand = `
      SELECT StateCode,
      StateDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_StateStp
      WHERE StateCode = @Code
      `;
      break;

    case "Transporter Setup":
      sqlCommand = `
      SELECT t.TranspID,
      t.TranspDesc,
      CASE t.Active
          WHEN 1 THEN 'True'
          WHEN 0 THEN 'False'
      END AS Active,
      CASE t.RcdType
          WHEN 0 THEN 'User'
          WHEN 1 THEN 'System'
      END AS RcdType,
      CASE t.TranspType
          WHEN 'I' THEN 'Internal Transporter'
          WHEN 'E' THEN 'External Transporter'
      END AS TranspType,
      c.ContactCode + ' - ' + c.ContactDesc AS ContactID
      FROM GMS_TranspStp t
      LEFT JOIN GMS_ContactStp c ON t.ContactKey = c.ContactKey
      WHERE t.TranspID = @Code
      `;
      break;

    case "UOM Setup":
      sqlCommand = `
      SELECT UOMCode,
      UOMDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      Symbol
      FROM GMS_UOMStp
      WHERE UOMCode = @Code
      `;
      break;

    case "Weighing Item Setup":
      sqlCommand = `
      SELECT A.WgItemCode,
      A.WgItemDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.WgItemTypeDesc,
      Case A.WgType
        WHEN 'D' THEN 'Despatch'
        WHEN 'R' THEN 'Receipt'
      END AS WgType
      FROM GMS_WgItemStp A
      LEFT JOIN GMS_WgItemTypeStp B ON A.ItemType = B.WgItemTypeCode
      WHERE A.WgItemCode = @Code
      `;
      break;

    case "Building Setup":
      sqlCommand = `
      SELECT
      A.BuildCode,
      A.BuildDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.BuildTypeCode + ' - ' + B.BuildTypeDesc AS BuildingType,
      CASE A.Material
        WHEN 'C' THEN 'Concrete'
        WHEN 'W' THEN 'Wooden'
      END AS Material,
      A.YrBuild,
      A.MaxMember,
      A.NoOfRooms,
      A.Address,
      A.Remarks,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM GMS_BuildStp A
      LEFT JOIN GMS_BuildTypeStp B ON A.BuildTypeKey = B.BuildTypeKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE A.BuildCode = @Code
      AND C.OUCode + ' - ' + C.OUDesc = @OU
      `;
      break;
    
    case "Building Type Setup":
      sqlCommand = `
      SELECT BuildTypeCode,
      BuildTypeDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      SeqNo,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_BuildTypeStp
      WHERE BuildTypeCode = @Code
      `;
      break;

    case "EPF Percentage Setup":
      sqlCommand = `
      SELECT EPFPerCode,
      EPFPerDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      EmpyEPFPer,
      CompEPFPer
      FROM GMS_EPFPerStp
      WHERE EPFPerCode = @Code
      `;
      break;

    case "Medical Leave Profile Setup":
      sqlCommand = `
      SELECT A.ProfileCode,
      A.ProfileDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_LeaveProfileStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.ProfileCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Payroll Deduction Code Setup':
      sqlCommand = `
      SELECT A.PayCode,
      A.PayDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.GrpCode + ' - ' + B.GrpDesc AS Groupby,
      A.DftAmt,
      CASE A.IsAlwChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwChangeRate,
      C.RecTypeCode + ' - ' + C.RecTypeDesc AS RecoveryType,
      CASE A.IsTaxPPh
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsTaxPPh
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayGrpCodeStp B ON A.PayGrpKey = B.PayGrpKey
      LEFT JOIN GMS_RecTypeStp C ON A.RecTypeKey = C.RecTypeKey
      WHERE A.Paycode = @Code
      `;
      break;

    case 'Payroll Reimbursement Code Setup':
      sqlCommand = `
      SELECT A.PayCode,
      A.PayDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.GrpCode + ' - ' + B.GrpDesc AS Groupby,
      A.DftAmt,
      CASE A.IsAlwChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwChangeRate
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayGrpCodeStp B ON A.PayGrpKey = B.PayGrpKey
      WHERE A.Paycode = @Code
      `;
      break;

    case "Activity Code Setup":
      sqlCommand = `
      SELECT A.Acode,
      A.ACodeDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.UOMCode + ' - ' + B.UOMDesc AS UOM,
      C.ACatCode + ' - ' + C.ACatDesc AS ActivityCategory,
      CASE A.IsAdopt
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAdopt,
      CASE A.AdoptDPF
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS AdoptDPF,
      CASE A.EnableManPRInc
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS EnableManPRInc,
      A.ManPRIncRate
      FROM GMS_ActivityCodeStp A
      LEFT JOIN GMS_UOMStp B ON A.UOMKey = B.UOMKey
      LEFT JOIN GMS_ActivityCatStp C ON A.Category = C.ACatKey
      WHERE A.ACode = @Code
      `;
      break;

    case "Crop Penalty Setup":
      sqlCommand = `
      SELECT A.CropPenaltyCode,
      A.CropPenaltyDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.DefRate,
      B.UOMCode + ' - ' + B.UOMDesc AS UOM,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM GMS_CropPenaltyStp A 
      LEFT JOIN GMS_UOMStp B ON A.UOMKey = B.UOMKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE A.CropPenaltyCode = @Code
      AND C.OUCode + ' - ' + C.OUDesc = @OU
      `;
      break;

    case "Agency Setup":
      sqlCommand = `
      SELECT AgencyCode,
      AgencyDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_AgencyStp
      WHERE AgencyCode = @Code
      `;
      break;

    case 'Checkroll Deduction Code Setup':
      sqlCommand = `
      SELECT A.PayCode,
      A.PayDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.GrpCode + ' - ' + B.GrpDesc AS Groupby,
      A.DftAmt,
      CASE A.IsAlwChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwChangeRate,
      C.RecTypeCode + ' - ' + C.RecTypeDesc AS RecoveryType,
      CASE A.IsTaxPPh
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsTaxPPh
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayGrpCodeStp B ON A.PayGrpKey = B.PayGrpKey
      LEFT JOIN GMS_RecTypeStp C ON A.RecTypeKey = C.RecTypeKey
      WHERE A.Paycode = @Code
      `;
      break;

    case 'Checkroll Reimbursement Code Setup':
      sqlCommand = `
      SELECT A.PayCode,
      A.PayDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.GrpCode + ' - ' + B.GrpDesc AS Groupby,
      A.DftAmt,
      CASE A.IsAlwChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwChangeRate
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayGrpCodeStp B ON A.PayGrpKey = B.PayGrpKey
      WHERE A.Paycode = @Code
      `;
      break;
    
    case 'Foreign Worker Batch Setup':
      sqlCommand = `
      SELECT FWBatchCode,
      FWBatchDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_FWBatchStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.FWBatchCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Gang Setup':
      sqlCommand = `
      SELECT
      A.GangCode,
      A.GangDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      C.EmpyID + ' - ' + C.EmpyName AS Mandor1,
      D.EmpyID + ' - ' + D.EmpyName AS Mandor2,
      E.EmpyID + ' - ' + E.EmpyName AS Checker,
      CASE A.EnableOWPayAcc
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS EnableOWPayAcc,
      F.AccNum + ' - ' + F.AccDesc AS PayableAccount,
      G.CCIDCode + ' - ' + G.CCIDDesc AS CCID,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_GangStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      LEFT JOIN GMS_EmpyPerMas C ON A.DefHarMdr = C.EmpyKey
      LEFT JOIN GMS_EmpyPerMas D ON A.DefHarMdr2 = D.EmpyKey
      LEFT JOIN GMS_EmpyPerMas E ON A.Checker = E.EmpyKey
      LEFT JOIN GMS_AccMas F ON A.PayableAccKey = F.AccKey
      LEFT JOIN V_SYC_CCIDMapping G ON A.PayableAccCCIDKey = G.CCIDKey
      WHERE A.GangCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Machinery Harvesting Setup':
      sqlCommand = `
      SELECT
      A.MacCode,
      A.MacDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.Rate,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_MacStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.MacCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case "Recovery Type Setup":
      sqlCommand = `
      SELECT RecTypeCode,
      RecTypeDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_RecTypeStp
      WHERE RecTypeCode = @Code
      `;
      break;

    case "Tall Palm Impediment Setup":
      sqlCommand = `
      SELECT A.TallPalmCode,
      A.TallPalmDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.Rate,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_TallPalmStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.TallPalmCode = @Code
      `;
      break;
    
    case "Terrain Setup":
      sqlCommand = `
      SELECT TerrainCode,
      TerrainDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_TerrainStp
      WHERE TerrainCode = @Code
      `;
      break;

    case 'Worker Batch Setup':
      sqlCommand = `
      SELECT FWBatchCode,
      FWBatchDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_FWBatchStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.FWBatchCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Store Setup':
      sqlCommand = `
      SELECT A.StoreCode,
      A.StoreDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.TransHierachy,
      B.CompCode + ' - ' + B.CompDesc AS Company,
      A.Remark,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM GMS_StoreStp A
      LEFT JOIN GMS_CompStp B ON A.CompKey = B.CompKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      WHERE A.StoreCode = @Code
      AND C.OUCode + ' - ' + C.OUDesc = @OU
      `;
      break;

    case 'Vehicle Setup':
      sqlCommand = `
      SELECT A.VehID,
      A.VehDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      C.VehTypeCode + ' - ' + C.VehTypeDesc AS VehicleType,
      D.OUCode + ' - ' + D.OUDesc AS Location,
      E.UOMCode + ' - ' + E.UOMDesc AS PrimaryUnit,
      F.UOMCode + ' - ' + F.UOMDesc AS FuelLubricantUnit,
      A.PriUnitRate,
      A.RegNo,
      A.Make,
      FORMAT(A.MthPurchased, 'dd/MM/yyyy') AS PurchasedMonth,
      A.YrMade,
      A.Model,
      A.EngineVIN,
      A.TyreFront,
      A.EngineCC,
      A.ChasisVIN,
      A.TyreRear,
      A.SerialNo,
      FORMAT(A.RdExpiredDate, 'dd/MM/yyyy') AS RoadTaxExpiry,
      CASE A.HasCL
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS HasCL,
      FORMAT(A.CLDate, 'dd/MM/yyyy') AS CarrierLicenseDate,
      CASE A.HasJPJ
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS HasJPJ,
      FORMAT(A.JPJDate, 'dd/MM/yyyy') AS InspectionDate,
      CASE A.HasNS
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS HasNS,
      FORMAT(A.NSDate, 'dd/MM/yyyy') AS NextServiceDate,
      FORMAT(A.TrnDate, 'dd/MM/yyyy') AS DateTransfer,
      A.ServInterval,
      A.TrnFrom,
      A.LastMeter,
      A.TrnTo,
      G.CompCode + ' - ' + G.CompDesc AS RegistrationCompany,
      A.Remarks,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_VehStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      LEFT JOIN GMS_VehTypeStp C ON A.VehTypeKey = C.VehTypeKey
      LEFT JOIN GMS_OUStp D ON A.LocKey = D.OUKey
      LEFT JOIN GMS_UOMStp E ON A.PriUOMKey = E.UOMKey
      LEFT JOIN GMS_UOMStp F ON A.FuelUOMKey = F.UOMKey
      LEFT JOIN GMS_CompStp G ON A.CompKey = G.CompKey
      WHERE A.VEHID = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Nursery Batch Category Setup':
      sqlCommand = `
      SELECT NurBatchCatCode,
      NurBatchCatDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      CASE IsVirtualNurseryBatch
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsVirtualNurseryBatch
      FROM GMS_NurBatchCatStp
      WHERE NurBatchCatCode = @Code
      `;
      break;

    case 'Mill Equipment Setup':
      sqlCommand = `
      SELECT A.MachCode,
      A.MachDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      C.StationCode + ' - ' + C.StationDesc AS Station,
      A.MachSpec,
      CASE A.IsKernelPress
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsKernelPress,
      A.Capacity,
      FORMAT(DATEADD(hour, 8, A.YearMade), 'yyyy') AS YearMade,
      D.UOMCode + ' - ' + D.UOMDesc AS UOM,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_MachStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      LEFT JOIN GMS_StationStp C ON A.StationKey = C.StationKey
      LEFT JOIN GMS_UOMStp D ON A.UOMKey = D.UOMKey
      WHERE A.MachCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Station Setup':
      sqlCommand = `
      SELECT A.StationCode,
      A.StationDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      CASE A.MachType
        WHEN 'OIL' THEN 'Oil Machinery'
        WHEN 'NUT' THEN 'Nut Machinery'
      END AS MachType,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_StationStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.StationCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Stock Adjustment Remark Setup':
      sqlCommand = `
      SELECT RemarkCode,
      RemarkDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      CASE Type
        WHEN 'SA' THEN 'Stock Adjustment'
      END AS Type
      FROM GMS_StockAdjRemarkStp
      WHERE RemarkCode = @Code
      `;
      break;

    case 'External Block Setup':
      sqlCommand = `
      SELECT A.BlockCode,
      A.BlockDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.EstateCode + ' - ' + B.EstateDesc AS CropSupplier,
      CASE A.Grade
        WHEN 'A' THEN 'A - GRADE A'
        WHEN 'B' THEN 'B - GRADE B'
      END AS Grade,
      C.TOERKERID + ' - ' + C.TOERKERDesc AS TheorethicalExtractionRatio,
      A.PlantedYr,
      CASE A.PlantedMth
        WHEN '4' THEN 'April'
        WHEN '9' THEN 'September'
        WHEN '11' THEN 'November'
      END AS PlantedMth,
      A.ABW,
      D.OUCode + ' - ' + D.OUDesc AS OU
      FROM GMS_OutsideBlockStp A
      LEFT JOIN GMS_EstateStp B ON A.EstateKey = B.EstateKey
      LEFT JOIN GMS_TOERKERStp C ON A.TOERKERKey = C.TOERKERKey
      LEFT JOIN GMS_OUStp D ON A.OUKey = D.OUKey
      WHERE BlockCode = @Code
      AND D.OUCode + ' - ' + D.OUDesc = @OU
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

    case "Medical Leave Profile Setup":
      sqlCommand = `
      SELECT C.AttdCode,
      C.AttdDesc,
      CASE B.LimitBy
        WHEN 1 THEN 'Year'
        WHEN 2 THEN 'Month'
      END AS LimitBy,
      B.LeaveAllowed
      FROM GMS_LeaveProfileStp A
      LEFT JOIN GMS_LeaveProfileDet B ON A.ProfileKey = B.ProfileKey
      LEFT JOIN GMS_AttdCodeStp C ON B.LeaveKey = C.AttdKey
      WHERE A.ProfileCode = @Code `;
      break;

    case 'Payroll Deduction Code Setup':
      sqlCommand = `
      SELECT C.OUCode + ' - ' + C.OUDesc AS OU,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      CASE WHEN E.CCIDKey = -1 THEN 'NA' ELSE E.CCIDCode + ' - ' + E.CCIDDesc END AS CCID
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayCodeOUStp B ON A.PayKey = B.PayKey
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
      LEFT JOIN GMS_AccMas D ON  B.AccKey = D.AccKey
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = B.CCIDKey
      WHERE A.Paycode = @Code`;
      break;

    case 'Payroll Reimbursement Code Setup':
      sqlCommand = `
      SELECT C.OUCode + ' - ' + C.OUDesc AS OU,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      CASE WHEN E.CCIDKey = -1 THEN 'NA' ELSE E.CCIDCode + ' - ' + E.CCIDDesc END AS CCID
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayCodeOUStp B ON A.PayKey = B.PayKey
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
      LEFT JOIN GMS_AccMas D ON  B.AccKey = D.AccKey
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = B.CCIDKey
      WHERE A.Paycode = @Code`;
      break;

    case "Activity Code Setup":
      sqlCommand = `
      SELECT C.OUCode + ' - ' + C.OUDesc AS OU,
      D.AccNum + ' - ' + D.AccDesc AS ExpenseAccount,
      B.Rate AS Ratenumeric,
      CASE B.IsAlwChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwChangeRate
      FROM GMS_ActivityCodeStp A
      LEFT JOIN GMS_ActivityCodeStpOU B ON A.ACodeKey = B.ACodeKey
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
      LEFT JOIN GMS_AccMas D ON B.AccKey = D.AccKey
      WHERE A.ACode = @Code `;
      break;

    case 'Checkroll Deduction Code Setup':
      sqlCommand = `
      SELECT C.OUCode + ' - ' + C.OUDesc AS OU,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      CASE WHEN E.CCIDKey = -1 THEN 'NA' ELSE E.CCIDCode + ' - ' + E.CCIDDesc END AS CCID
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayCodeOUStp B ON A.PayKey = B.PayKey
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
      LEFT JOIN GMS_AccMas D ON  B.AccKey = D.AccKey
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = B.CCIDKey
      WHERE A.Paycode = @Code`;
      break;

    case 'Checkroll Reimbursement Code Setup':
      sqlCommand = `
      SELECT C.OUCode + ' - ' + C.OUDesc AS OU,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      CASE WHEN E.CCIDKey = -1 THEN 'NA' ELSE E.CCIDCode + ' - ' + E.CCIDDesc END AS CCID
      FROM GMS_PayCodeStp A
      LEFT JOIN GMS_PayCodeOUStp B ON A.PayKey = B.PayKey
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
      LEFT JOIN GMS_AccMas D ON  B.AccKey = D.AccKey
      LEFT JOIN V_SYC_CCIDMapping E ON E.CCIDKey = B.CCIDKey
      WHERE A.Paycode = @Code`;
      break;

    case 'Station Setup':
      sqlCommand = `
      SELECT C.AccNum + ' - ' + C.AccDesc AS Account
      FROM GMS_StationStp A
      LEFT JOIN GMS_StationAccStp B ON A.StationKey = B.StationKey
      LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
      WHERE A.StationCode = @Code`;
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
