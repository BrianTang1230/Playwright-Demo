function marketingSQLCommand(formName) {
  let sqlCommand = `
  DECLARE @OU VARCHAR(100) = 
    CASE WHEN @region = 'IND'
         THEN 'LSPH - PT. LIBO SAWIT PERKASA'
         ELSE 'BWHO - HEAD OFFICE'
    END;`;

  switch (formName) {
    case "Sales Contract Allocation":
      sqlCommand += `
        select A.ContractNo,
        FORMAT(A.ContractDate,'dd/MM/yyyy') as ContractDate, 
        FORMAT(A.ContractExpDate,'dd/MM/yyyy') as ContractExpDate,
        case A.Status
          when 'OP' then 'OPEN'
          when 'AP' then 'APPROVED'
          when 'SM' then 'SUBMITED'
          when 'VD' then 'VOIDED'
          when 'RJ' then 'REJECTED'
          when 'CL' then 'CLOSED'
        end as Status,
        B.WgItemCode + ' - ' + B.WgItemDesc as Item,
        C.CertCode + ' - ' + C.CertDesc as Certification,
        IIF(@region = 'IND',
          FORMAT(A.MthOfCollection,'MMMM yyyy','id-ID'),
          FORMAT(A.MthOfCollection,'MMMM yyyy','en-US')
        ) as MthOfCollection,
        D.ContactCode + ' - ' + D.ContactDesc as Customer,
        case 
          when A.FullyBilled = 0 then 'False'
          when A.FullyBilled = 1 then 'True'
        end as FullBill,
        A.Qty,
        A.Tolerance,
        A.Qty * A.Tolerance / 100 + A.Qty as MaxLimit,
        G.CurrCode + ' - ' + G.CurrDesc as Currency,
        A.UnitPrice,
        A.PremiumUnitPrice as PremiumPrice,
        A.UnitPrice + A.PremiumUnitPrice as FinalUnitPrice,
        A.TotalPrice,
        case 
          when A.TradeTerm = 'CIF' then A.TradeTerm + ' - COST, INSURANCE AND FREIGHT'
          when A.TradeTerm = 'FOB' then A.TradeTerm + ' - FREE ON BOARD'
          else A.TradeTerm
        end as TradeTerm,
        upper(A.PriceBasis) as PriceBasis,
        case
          when A.DeliveryType = 'L' then 'LOCO'
          when A.DeliveryType = 'F' then 'FRANCO'
        end as DeliveryType,
        E.PayTermCode + ' - ' + E.PayTermDesc as PayTerm,
        case 
          when A.WeightBasis = 'D' then 'DELIVERED WEIGHT'
          when A.WeightBasis = 'S' then 'SUPPLIED WEIGHT'
        end as WeightBasis,
        A.BuyerRef,
        A.BrokerRef,
        A.Comodity,
        A.QualitySpec,
        A.QuantityRmks,
        A.DeliveryRmks,
        A.ReferenceRmks,
        A.ValidityPeriod,
        A.CollectionRmks,
        A.QualityRmks,
        A.PriceRmks,
        A.PymtTerm,
        A.OtherTerm,
        A.CarbonCopy,
        A.ContractNo as ContractNo2,
        FORMAT(A.ContractDate,'dd/MM/yyyy') + '-' + FORMAT(A.ContractExpDate,'dd/MM/yyyy') as ContractDateRange,
        B.WgItemCode + ' - ' + B.WgItemDesc as Item2,
        D.ContactCode + ' - ' + D.ContactDesc as Customer2,
        F.OUCode + ' - ' + F.OUDesc as OU
        from MKT_Contract A
        left join GMS_WgItemStp B on A.ItemKey = B.WgItemKey
        left join GMS_CertStp C on A.CertKey = C.CertKey
        left join GMS_ContactStp D on A.BuyerKey = D.ContactKey
        left join GMS_PayTermStp E on A.PayTermKey = E.PayTermKey
        left join GMS_OUStp F on A.OUKey = F.OUKey
        left join GMS_CurrencyStp G on A.CurrKey = G.CurrKey
        where A.ContractSID = @DocNo
        and F.OUCode + ' - ' + F.OUDesc = @OU`;
      break;

    case "Sales Contract Delivery Order":
      sqlCommand += `
        select A.DONo,
        case 
          when A.DOType = 'E' then 'EXTERNAL DELIVERY ORDER'
          when A.DOType = 'I' then 'INTERNAL DELIVERY ORDER'
        end as DOType,
	    	case A.Status
          when 'OP' then 'OPEN'
          when 'AP' then 'APPROVED'
          when 'SM' then 'SUBMITED'
          when 'VD' then 'VOIDED'
          when 'RJ' then 'REJECTED'
          when 'CL' then 'CLOSED'
        end as Status,
        FORMAT(A.DODate,'dd/MM/yyyy') as DODate,
        FORMAT(A.DeliveryDate,'dd/MM/yyyy') as DeliveryDate,
        B.OUCode + ' - ' + B.OUDesc as Despatcher,
        case A.RecvKey
          when -1 then null
          else C.RCVDesc 
		    end as Recv,
        A.DOQty,
        D.ContractNo as ContractNo,
        E.CertCode + ' - ' + E.CertDesc as Certification,
        FORMAT(D.ContractDate,'dd/MM/yyyy') as ContractDate,
        FORMAT(D.ContractExpDate,'dd/MM/yyyy') as ContractExpDate,
        G.WgItemCode + ' - ' + G.WgItemDesc as Item,
        case 
          when D.WeightBasis = 'D' then 'DELIVERED WEIGHT'
          when D.WeightBasis = 'S' then 'SUPPLIED WEIGHT'
        end as WeightBasis,
        H.ContactCode + ' - ' + H.ContactDesc as Buyer,
        K.CurrCode + ' - ' + K.CurrDesc as Currency,
        D.Qty,
        D.FinalUnitPrice,
        D.TotalPrice,
        I.TranspDesc as Transp,
        A.TranspRefNo,
        FORMAT(A.TranspDODate,'dd/MM/yyyy') as TranspDODate,
        J.OUCode + ' - ' + J.OUDesc as OU
        from MKT_ContractDO A
        left join GMS_OUStp B on A.RecvOUKey = B.OUKey
        left join GMS_RcvStp C on A.RecvKey = C.RCVKey
        left join MKT_Contract D on A.ContractKey = D.ContractKey
        left join GMS_CertStp E on A.CertKey = E.CertKey
        left join GMS_WgItemStp G on D.ItemKey = G.WgItemKey
        left join GMS_ContactStp H on D.BuyerKey = H.ContactKey
        left join GMS_TranspStp I on A.TranspKey = I.TranspKey
        left join GMS_OUStp J on A.OUKey = J.OUKey
		    left join GMS_CurrencyStp K on D.CurrKey = K.CurrKey
        where A.ContractDOSID = @DocNo and J.OUCode + ' - ' + J.OUDesc = @OU`;
      break;

    default:
      throw new Error(`Unknown formName: ${formName}`);
  }

  return sqlCommand;
}

module.exports = { marketingSQLCommand };
