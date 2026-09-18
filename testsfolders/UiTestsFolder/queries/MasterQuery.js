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
    
    case "Beneficiary Information Setup":
      sqlCommand = `
      SELECT A.BeneficiaryName,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.BankAccNum,
      B.BankName,
      A.ICNO,
      A.OldICNO,
      A.BRNO,
      A.PoliceArmyPassNO,
      CASE A.IsReqCheck
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsReqCheck,
      A.Email,
      A.ExtRef,
      A.Address1,
      A.PostCode,
      A.City,
      A.State,
      C.CtryCode + ' - ' + C.CtryDesc AS Country
      FROM GMS_BeneficiaryStp A
      LEFT JOIN SYT_BNMCode B ON A.BNMCode = B.BNMCode
      LEFT JOIN GMS_CountryStp C ON A.CtryKey = C.CtryKey
      WHERE BeneficiaryName = @Code
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

    case "Department Setup":
      sqlCommand = `
      SELECT DeptCode,
      DeptDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_DeptStp
      WHERE DeptCode = @Code
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

    case "Employee Grade Setup":
      sqlCommand = `
      SELECT EmpyCradeCode,
      EmplyGradeDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_EmpyGradeStp
      WHERE EmpyCradeCode = @Code
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

    case "Holiday Profile Setup":
      sqlCommand = `
      SELECT ProfileCode,
      ProfileDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      Yr
      FROM GMS_HolidayProfileStp
      WHERE ProfileCode = @Code
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

    case "Oil Mill Setup":
      sqlCommand = `
      SELECT A.MillCode,
      A.MillDesc,
      CASE A.Active
          WHEN 1 THEN 'True'
          WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
          WHEN 0 THEN 'User'
          WHEN 1 THEN 'System'
      END AS RcdType,
      B.RegionDesc,
      CASE A.MillType
          WHEN 'O' THEN 'Internal Mill'
          WHEN 'E' THEN 'External Mill'
      END AS MillType,
      C.OUCode + ' - ' + C.OUDesc AS LocationOU,
      D.ContactCode + ' - ' + D.ContactDesc AS ContactID,
      A.MillManager,
      A.MPOBLicenseNo,
      A.Remarks
      FROM GMS_MillStp A
      LEFT JOIN GMS_RegionStp B ON A.RegionKey = B.RegionKey
      LEFT JOIN GMS_OUStp C ON A.OUKey = C.OUKey
      LEFT JOIN GMS_ContactStp D ON A.ContactKey = D.ContactKey
      WHERE MillCode = @Code
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

    case "Position Setup":
      sqlCommand = `
      SELECT A.PostCode,
      A.PostDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.PostTypeCode + ' - ' + B.PostTypeDesc AS PositionType
      FROM GMS_PostStp A
      LEFT JOIN GMS_PostTypeStp B ON A.PostTypeKey = B.PostTypeKey
      WHERE A.PostCode = @Code
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

    case 'Activity Category Setup':
      sqlCommand = `
      SELECT ACatCode,
      ACatDesc,
      CASE ActivityType
        WHEN 'D' THEN 'Driver'
        WHEN 'O' THEN 'Others'
      END AS ActivityType,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_ActivityCatStp
      WHERE ACatCode = @Code
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

    case 'Item Category Setup':
      sqlCommand = `
      SELECT ItemCatCode,
      ItemCatDesc,
      CASE Type
        WHEN 'F' THEN 'Fertilizer'
        WHEN 'P' THEN 'Pesticide'
        WHEN 'O' THEN 'Others'
      END AS Type,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      CASE EnableAutoNo
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS EnableAutoNo,
      Prefix,
      NextNum,
      NumLength,
      NextItemID
      FROM GMS_ItemCatStp
      WHERE ItemCatCode = @Code
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

    case 'Vehicle Type Setup':
      sqlCommand = `
      SELECT A.VehTypeCode,
      A.VehTypeDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.AllocSeq,
      B.UOMCode + ' - ' + B.UOMDesc AS PrimaryUnit,
      C.UOMCode + ' - ' + C.UOMDesc AS SecondaryUnit,
      D.UOMCode + ' - ' + D.UOMDesc AS FuelLubricantUnit,
      A.PriUnitRate
      FROM GMS_VehTypeStp A
      LEFT JOIN GMS_UOMStp B ON A.PriUOMKey = B.UOMKey
      LEFT JOIN GMS_UOMStp C ON A.SecUOMKey = C.UOMKey
      LEFT JOIN GMS_UOMStp D ON A.FuelUOMKey = D.UOMKey
      WHERE A.VehTypeCode = @Code
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

    case 'Nursery Batch Setup':
      sqlCommand = `
      SELECT A.NurBatchCode,
      A.NurBatchDesc,
      C.PlantMateCode + ' - ' + C.PlantMateDesc AS PlantingMaterial,
      D.CropCode + ' - ' + D.CropDesc AS Crop,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.IsProgramComplete
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsProgramComplete,
      FORMAT(A.ProgramCompleteDate, 'dd/MM/yyyy') AS ProgramCompletedDate,
      E.ContactCode + ' - ' + E.ContactDesc AS Supplier,
      FORMAT(DATEFROMPARTS(A.PlantedYr, A.PlantedMth, 1), 'MMMM yyyy') AS PlantedPeriod,
      FORMAT(A.SalesExpectedDate, 'MMMM yyyy') AS SalesExpectedDate,
      F.NurBatchCatCode + ' - ' + F.NurBatchCatDesc AS NurseryBatchCategory,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_NurBatchStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      LEFT JOIN GMS_PlantMateStp C ON A.PlantMateKey = C.PlantMateKey
      LEFT JOIN GMS_CropStp D ON A.CropKey = D.CropKey
      LEFT JOIN GMS_ContactStp E ON A.ContactKey = E.ContactKey
      LEFT JOIN GMS_NurBatchCatStp F ON A.NurBatchCatKey = F.NurBatchCatKey
      WHERE NurBatchCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
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

    case 'Storage Tank Setup':
      sqlCommand = `
      SELECT A.StorageCode,
      A.StorageDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      CASE A.StorageType
        WHEN 'OWN' THEN 'Internal Storage'
        WHEN 'OUT' THEN 'External Storage'
      END AS StorageType,
      C.ContactCode + ' - ' + C.ContactDesc AS ContactID,
      CASE A.TankType
        WHEN 'CPO' THEN 'CPO Tank'
        WHEN 'CPKO' THEN 'CPKO Tank'
      END AS TankType,
      D.TypeIDCode + ' - ' + D.TypeIDDesc AS TestComponentCode,
      A.MPOBStorageCode,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_StorageStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      LEFT JOIN GMS_ContactStp C ON A.ContactKey = C.ContactKey
      LEFT JOIN GMS_TypeIDStp D ON A.TypeIDKey = D.TypeIDKey
      WHERE A.StorageCode = @Code
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

    case 'Supplier Category Setup':
      sqlCommand = `
      SELECT SuppCatCode,
      SuppCatDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      SeqNo,
      CASE BlockWtDistMtd
        WHEN 'AD' THEN 'After Deducted Weight'
        WHEN 'BD' THEN 'Bedfore Deducted Weight'
      END AS BlockWtDistMtd
      FROM GMS_SuppCatStp
      WHERE SuppCatCode = @Code
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

    case "WB Authorization Case Setup":
      sqlCommand = `
      SELECT WBAuthCaseCode,
      WBAuthCaseDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_WBAuthCaseStp
      WHERE WBAuthCaseCode = @Code
      `;
      break;
    
    case "Destination Setup":
      sqlCommand = `
      SELECT A.DeliverytoCode,
      A.DeliveryToDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.ContactCode + ' - ' + B.ContactDesc AS ContactID,
      A.Addr1,
      A.Addr2,
      A.Addr3,
      A.Addr4
      FROM GMS_DeliveryToStp A
      LEFT JOIN GMS_ContactStp B ON A.ContactKey = B.ContactKey
      WHERE A.DeliveryToCode = @Code
      `;
      break;

    case 'Loading Type Setup':
      sqlCommand = `
      SELECT A.LoadTypeCode,
      A.LoadTypeDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.RatePerMT,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_LoadTypeStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.LoadTypeCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;
    
    case 'Test Component Type Setup':
      sqlCommand = `
      SELECT A.TypeCode,
      A.TypeDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.Seq,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_TypeStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.TypeCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Chemical Setup':
      sqlCommand = `
      SELECT A.ChemCode,
      A.ChemDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_ChemStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.ChemCode = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Loss Recovery Type Setup':
      sqlCommand = `
      SELECT A.LossRecTypeID,
      A.LossRecTypeDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      CASE A.LossType
        WHEN 'OL' THEN 'Oil Losses'
        WHEN 'KOL' THEN 'Kernel Oil Losses'
      END AS LossType,
      CASE A.SourceType
        WHEN 'CPKOLOSS' THEN 'Kernel Oil Losses'
        WHEN 'EFBLOSS' THEN 'Losses In Empty Bunch'
      END AS SourceType,
      CASE A.ResultType
        WHEN 'NOS' THEN 'NOS'
        WHEN 'LEFB' THEN 'Losses In EFB'
      END AS ResultType,
      A.MassBal,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_LossRecTypeStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.LossRecTypeID = @Code
      AND B.OUCode + ' - ' + B.OUDesc = @OU
      `;
      break;

    case 'Contractor Conductor Setup':
      sqlCommand = `
      SELECT B.EmpyID + ' - ' + B.EmpyName AS StaffID,
      CASE A.IsGenWork
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsGenWork,
      CASE A.IsFFBTrans
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsFFBTrans,
      C.OUCode + ' - ' + C.OUDesc AS OU
      FROM GMS_EmpyContractStp A
      LEFT JOIN GMS_EmpyPerMas B ON A.EmpyKey = B.EmpyKey
      LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
      WHERE B.EmpyID + ' - ' + B.EmpyName = @Code
      AND C.OUCode + ' - ' + C.OUDesc = @OU
      `;
      break;

    case 'Job Category Setup':
      sqlCommand = `
      SELECT JobCatCode,
      JobCatDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_JobCatStp
      WHERE JobCatCode = @Code
      `;
      break;

    case 'Job Setup':
      sqlCommand = `
      SELECT A.JobCode,
      A.JobDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.JobCatCode + ' - ' + B.JobCatDesc AS JobCategory,
      CASE A.JobType
        WHEN 'G' THEN 'General Work'
        WHEN 'T' THEN 'FFB Transportation'
      END AS JobType,
      C.UOMCode + ' - ' + C.UOMDesc AS UOM,
      D.AccNum + ' - ' + D.AccDesc AS Account,
      A.Rate,
      CASE A.IsAlwChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwChangeRate,
      CASE A.IsAlwJRChangeRate
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwJRChangeRate,
      CASE A.IsAlwOpenQty
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS IsAlwOpenQty
      FROM GMS_JobStp A
      LEFT JOIN GMS_JobCatStp B ON A.JobCatKey = B.JobCatKey
      LEFT JOIN GMS_UOMStp C ON A.UOMKey = C.UOMKey
      LEFT JOIN GMS_AccMas D ON A.ExpAccKey = D.AccKey
      WHERE A.JobCode = @Code
      `;
      break;

    case 'Pickup Point Setup':
      sqlCommand = `
      SELECT PickCode,
      PickDesc,
      CASE Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_PickupPointStp
      WHERE PickCode = @Code
      `;
      break;
    
    case 'FFB Deduction Setup':
      sqlCommand = `
      SELECT A.DeductionCode,
      A.DeductionDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      A.DefRate,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_DeductionStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.DeductionCode = @Code
      `;
      break;
    
    case 'FFB Subsidy Setup':
      sqlCommand = `
      SELECT A.SubsidyCode,
      A.SubsidyDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_SubsidyStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      WHERE A.SubsidyCode = @Code
      `;
      break;

    case 'Account Sub Category Setup':
      sqlCommand = `
      SELECT A.AccSubCatCode,
      A.AccSubCatDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      B.AccCatDesc,
      CASE A.RcdType
        WHEN 0 THEN 'User'
        WHEN 1 THEN 'System'
      END AS RcdType
      FROM GMS_AccSubCatStp A
      LEFT JOIN GMS_AccCatStp B ON A.AccCatKey = B.AccCatKey
      WHERE A.AccSubCatCode = @Code
      `;
      break;

    case 'Bank Setup':
      sqlCommand = `
      SELECT A.BankCode,
      A.BankDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      B.BankName AS Bank,
      A.BankName AS BankName,
      A.BrachName,
      A.PhyBankAcc,
      C.AccNum + ' - ' + C.AccDesc AS BankGLAC,
      D.CurrCode + ' - ' + D.CurrDesc AS Currency,
      CASE A.PayStaSubmit
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS PayStaSubmit,
      A.APOrgCode,
      A.CPerson,
      A.Post,
      A.Phone,
      A.Fax,
      A.Email,
      A.Street,
      A.PostCode,
      A.City,
      A.State,
      E.CtryCode + ' - ' + E.CtryDesc AS PermanentCountry
      FROM GMS_BankStp A
      LEFT JOIN SYT_BNMCode B ON A.BNMCode = B.BNMCode
      LEFT JOIN GMS_AccMas C ON A.BankAccKey = C.AccKey
      LEFT JOIN GMS_CurrencyStp D ON A.CurrKey = D.CurrKey
      LEFT JOIN GMS_CountryStp E ON A.CtryKey = E.CtryKey
      WHERE A.BankCode = @Code
      `;
      break;

      case 'Capital Expenditure Category Setup':
      sqlCommand = `
      SELECT A.CapexCatCode,
      A.CapexCatDesc,
      CASE A.Active
        WHEN 1 THEN 'True'
        WHEN 0 THEN 'False'
      END AS Active,
      C.AccNum + ' - ' + C.AccDesc AS DefaultAccount,
      B.OUCode + ' - ' + B.OUDesc AS OU
      FROM GMS_CapexCatStp A
      LEFT JOIN GMS_OUStp B ON A.OUKey = B.OUKey
      LEFT JOIN GMS_AccMas C ON A.DeftAcc = C.AccKey
      WHERE A.CapexCatCode = @Code
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

    case 'Holiday Profile Setup':
      sqlCommand = `
      SELECT FORMAT(B.HolidayDate, 'dd/MM/yyyy') AS Date,
      B.HolidayDesc
      FROM GMS_HolidayProfileStp A
      LEFT JOIN GMS_HolidayProfileDet B ON A.ProfileKey = B.ProfileKey
      WHERE ProfileCode = @Code `;
      break;
    
    case 'Position Setup':
      sqlCommand = `
      SELECT B.Description,
      B.FromYr,
      B.ToYr,
      B.Amt
      FROM GMS_PostStp A
      LEFT JOIN GMS_TMKDet B ON A.PostKey = B.PostKey
      WHERE A.PostCode = @Code `;
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

    case 'Vehicle Type Setup':
      sqlCommand = `
      SELECT C.AccNum + ' - ' + C.AccDesc AS Account
      FROM GMS_VehTypeStp A
      LEFT JOIN GMS_VehAccStp B ON A.VehTypeKey = B.VehTypeKey
      LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
      WHERE A.VehTypeCode = @Code`;
      break;

    case 'Station Setup':
      sqlCommand = `
      SELECT C.AccNum + ' - ' + C.AccDesc AS Account
      FROM GMS_StationStp A
      LEFT JOIN GMS_StationAccStp B ON A.StationKey = B.StationKey
      LEFT JOIN GMS_AccMas C ON B.AccKey = C.AccKey
      WHERE A.StationCode = @Code`;
      break;

    case 'Loss Recovery Type Setup':
      sqlCommand = `
      SELECT C.TypeIDCode,
      C.TypeIDDesc,
      D.TypeCode
      FROM GMS_LossRecTypeStp A
      LEFT JOIN GMS_LossRecTypeDet B ON A.LossRecTypeKey = B.LossRecTypeKey
      LEFT JOIN GMS_TypeIDStp C ON B.TypeIDKey = C.TypeIDKey
      LEFT JOIN GMS_TypeStp D ON C.TypeKey = D.TypeKey
      WHERE A.LossRecTypeID = @Code`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

function masterTreeViewSQLCommand(formName) {
  const formConfigs = {
    'Beneficiary Information Setup': {
      table: 'GMS_BeneficiaryStp',
      ouTable: 'GMS_BeneficiaryStpOU',
      key: 'BenKey',
      whereCol: 'BeneficiaryName'
    },
    'Department Setup': {
      table: 'GMS_DeptStp',
      ouTable: 'GMS_DeptStpOU',
      key: 'DeptKey',
      whereCol: 'DeptCode'
    },
    'Employee Grade Setup': {
      table: 'GMS_EmpyGradeStp',
      ouTable: 'GMS_EmpyGradeStpOU',
      key: 'EmpyGradeKey',
      whereCol: 'EmpyCradeCode'
    },
    'Holiday Profile Setup': {
      table: 'GMS_HolidayProfileStp',
      ouTable: 'GMS_HolidayProfileStpOU',
      key: 'ProfileKey',
      whereCol: 'ProfileCode'
    },
    'Oil Mill Setup': {
      table: 'GMS_MillStp',
      ouTable: 'GMS_MillStpOU',
      key: 'MillKey',
      whereCol: 'MillCode'
    },
    'Position Setup': {
      table: 'GMS_PostStp',
      ouTable: 'GMS_PostStpOU',
      key: 'PostKey',
      whereCol: 'PostCode'
    },
    'Activity Category Setup': {
      table: 'GMS_ActivityCatStp',
      ouTable: 'GMS_ActivityCatStpOU',
      key: 'ACatKey',
      whereCol: 'ACatCode'
    },
    'Job Setup': {
      table: 'GMS_JobStp',
      ouTable: 'GMS_JobStpOU',
      key: 'JobKey',
      whereCol: 'JobCode'
    },
    'Pickup Point Setup': {
      table: 'GMS_PickupPointStp',
      ouTable: 'GMS_PickupPointStpOU',
      key: 'PickKey',
      whereCol: 'PickCode'
    },
    'Bank Setup': {
      table: 'GMS_BankStp',
      ouTable: 'GMS_BankStpOU',
      key: 'BankKey',
      whereCol: 'BankCode'
    }
  };

  const config = formConfigs[formName];
  if (!config) {
    throw new Error(`Unknown formName: ${formName}`);
  }

  return `
    SELECT D.OperationTypeDesc + '/' + C.OUDesc AS OUSelect
    FROM ${config.table} A
    LEFT JOIN ${config.ouTable} B ON A.${config.key} = B.${config.key}
    LEFT JOIN GMS_OUStp C ON B.OUKey = C.OUKey
    LEFT JOIN GMS_OperationTypeStp D ON C.OperationTypeKey = D.OperationTypeKey
    WHERE A.${config.whereCol} = @Code
  `;
}

module.exports = {
  masterSQLCommand,
  masterGridSQLCommand,
  masterTreeViewSQLCommand,
};
