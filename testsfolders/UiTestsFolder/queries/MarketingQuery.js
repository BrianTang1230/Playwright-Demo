function marketingSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Sales Contract Allocation":
      sqlCommand = `
        select A.ContractNo, 
        FORMAT(A.ContractDate,'dd/MM/yyyy') as ContractDate, 
        FORMAT(A.ContractExpDate,'dd/MM/yyyy') as ContractExpDate, 
        B.WgItemCode + ' - ' + B.WgItemDesc as Item,
        C.CertCode + ' - ' + C.CertDesc as Certification,
        FORMAT(A.MthOfCollection,'MMMM yyyy') as MthOfCollection,
        D.ContactCode + ' - ' + D.ContactDesc as Customer,
        case 
          when A.FullyBilled = 0 then 'False'
          when A.FullyBilled = 1 then 'True'
        end as FullBill,
        A.Qty as Qty,
        A.Tolerance as Tolerance,
        A.UnitPrice as UnitPrice,
        A.PremiumUnitPrice as PremiumPrice,
        case 
          when A.TradeTerm = 'CIF' then A.TradeTerm + ' - ' + 'COST, INSURANCE AND FREIGHT'
          when A.TradeTerm = 'FOB' then A.TradeTerm + ' - ' + 'FREE ON BOARD'
        end as TradeTerm,
        upper(A.PriceBasis) as PriceBasis,
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
        F.OUCode + ' - ' + F.OUDesc as OU
        from MKT_Contract A
        left join GMS_WgItemStp B on A.ItemKey = B.WgItemKey
        left join GMS_CertStp C on A.CertKey = C.CertKey
        left join GMS_ContactStp D on A.BuyerKey = D.ContactKey
        left join GMS_PayTermStp E on A.PayTermKey = E.PayTermKey
        left join GMS_OUStp F on A.OUKey = F.OUKey
        where A.ContractSID = @DocNo
        and F.OUCode + ' - ' + F.OUDesc = @OU`;
      break;

    case "Sales Contract Delivery Order":
      sqlCommand = `
        select A.DONo,
        case 
          when A.DOType = 'E' then 'EXTERNAL DELIVERY ORDER'
          when A.DOType = 'I' then 'INTERNAL DELIVERY ORDER'
        end as DOType,
        FORMAT(A.DODate,'dd/MM/yyyy') as DODate,
        FORMAT(A.DeliveryDate,'dd/MM/yyyy') as DeliveryDate,
        B.OUCode + ' - ' + B.OUDesc as Despatcher,
        C.RCVDesc as Recv,
        A.DOQty,
        D.ContractNo as ContractNo,
        E.CertCode + ' - ' + E.CertDesc as Certification,
        G.WgItemCode + ' - ' + G.WgItemDesc as Item,
        case 
          when A.WeightBasis = 'D' then 'DELIVERED WEIGHT'
          when A.WeightBasis = 'S' then 'SUPPLIED WEIGHT'
        end as WeightBasis,
        H.ContactCode + ' - ' + H.ContactDesc as Buyer,
        I.TranspDesc as Transp,
        A.TranspRefNo,
        FORMAT(A.TranspDODate,'dd/MM/yyyy') as TranspDODate,
        J.OUCode + ' - ' + J.OUDesc as OU
        from MKT_ContractDO A
        left join GMS_OUStp B on A.RecvOUKey = B.OUKey
        left join GMS_RcvStp C on A.RecvKey = C.RCVKey
        left join MKT_Contract D on A.ContractKey = D.ContractKey
        left join GMS_CertStp E on A.CertKey = E.CertKey
        left join GMS_WgItemStp G on A.ItemKey = G.WgItemKey
        left join GMS_ContactStp H on A.BuyerKey = H.ContactKey
        left join GMS_TranspStp I on A.TranspKey = I.TranspKey
        left join GMS_OUStp J on A.OUKey = J.OUKey
        where A.ContractDOSID = @DocNo and J.OUCode + ' - ' + J.OUDesc = @OU`;
      break;
  }

  return sqlCommand;
}

module.exports = { marketingSQLCommand };
