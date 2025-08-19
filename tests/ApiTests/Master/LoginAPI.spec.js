// const { expect } = require("@playwright/test"); // ✅ Import expect
// const { test } = require("../fixtures/fixtures"); // ✅ Import test with fixture

// test("call secured API", async ({ request, authToken }) => {
//   const res = await request.get(
//     "https://qa.quarto.cloud/zmasterapi/odata/User?UserEmail=%27lmsupport@lintramax.com%27&dummy=1&$format=json&$select=UserID,UserName,DefaultOUKey,DefaultOUCode,DefaultCompKey,DefaultDeptKey,ClientID,IsLMStaff,EnableBaitulmal,isAvgABWByPeriod,IsTaxContCompulsory,IsTaxEditable,IsAutomatedOUAllocation,MasterNoPolicy,IsShowAddRemEPF,IsDemo,UserKey,ClientKey,IsShowDivider,IsSubLMUser,WBWtDisplayMtd,ApprovePRBy,ApproveCRBy,TimeZoneOffset,EPFDeductionMtdForPCB",
//     {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     }
//   );

//   console.log("🔍 API Response:", await res.json()); // ✅ Debug print
//   expect(res.status()).toBe(200);
// });
