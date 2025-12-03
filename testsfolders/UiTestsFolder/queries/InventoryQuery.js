function inventorySQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Stock Receipt":
      sqlCommand = `
        select FORMAT(A.RcvDate,'dd/MM/yyyy') as RcvDate,
        case 
            when A.POKey = '-1' then 'False'
            else 'True'
        end as WithPO,
        case 
            when A.POKey = '-1' then 'NA'
            else B.PONum
        end as PONo,
        C.ContactCode + ' - ' + C.ContactDesc as Supplier,
        A.DORefNum as DORef,
        A.Remarks,
        Z.OUCode + ' - ' + Z.OUDesc as OU
        from STO_RcvHdr A
        left join PROC_POHdr B on A.POKey = B.POKey
        left join GMS_ContactStp C on A.VendKey = C.ContactKey
        left join GMS_OUStp Z on A.OUKey = Z.OUKey
        where A.RcvNum = @DocNo and Z.OUCode + ' - ' + Z.OUDesc = @OU`;
      break;
  }

  return sqlCommand;
}

function inventoryGridSQLCommand(formName) {
  let sqlCommand = "";

  switch (formName) {
    case "Stock Receipt":
      sqlCommand = `
      select B.ItemID + ' - ' + B.ItemDesc as Item,
        A.Remarks as ItemDesc,
        D.StoreCode + ' - '+ D.StoreDesc as Store,
        A.StdQty as Qty,
        C.UOMCode as UOM,
        A.TransAmt as Amount,
        A.TranspCost,
        case when A.TranspCostTreatment = 'IA' then 'Item Absorb'
        end as Treatment
        from STO_Mvmt A
        left join GMS_ItemMas B on A.ItemKey = B.StoItemKey
        left join GMS_UOMStp C on A.UOMKey = C.UOMKey
        left join GMS_StoreStp D on A.StoreKey = D.StoreKey
        left join PROC_PODet E on A.POItemKey = E.POItemKey
        where A.RcvKey in (
        select X.RcvKey from STO_RcvHdr X
        left join GMS_OUStp Y on X.OUKey = Y.OUKey
        where X.RcvNum = @DocNo and Y.OUCode + ' - ' + Y.OUDesc = @OU
        )
        `;
      break;
  }

  return sqlCommand;
}

module.exports = { inventorySQLCommand, inventoryGridSQLCommand };
