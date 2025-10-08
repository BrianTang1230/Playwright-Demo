import { test, expect, request } from '@playwright/test';

test('Add new General Journal transaction via API', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://qa.quarto.cloud/financeapi/api',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'YOUR_TOKEN_HERE',
    },
  });

  const payload = {
    TransHdrKey: 501379,
    ClientKey: 1,
    OUKey: 16,
    OUCode: "PMCE",
    DocNum: "JV25100001",
    Source: "GJ",
    DocType: "JV",
    GLDate: "2025-10-02T05:20:29.802Z",
    GLDesc: "Testing",
    FY: 2026,
    Period: 6,
    CurrKey: 100,
    CurrCode: "MYR",
    DocAmt: 30.0,
    glDetails: [
      { AccKey: 3256, AccNum: "12011010", AccDesc: "PAYMENT ADVANCE - PI", OUKey: 16, OUCode: "PMCE", FuncTransAmt: -30.0, LocalTransAmt: -30.0, SeqNo: 1, RowState: 1 },
      { AccKey: 3256, AccNum: "12011010", AccDesc: "PAYMENT ADVANCE - PI", OUKey: 16, OUCode: "PMCE", FuncTransAmt: 30.0, LocalTransAmt: 30.0, SeqNo: 2, RowState: 1 }
    ]
  };

  const url = "/GL?form='GL'&Environment=qaa&AttachmentID=\"\"";
  console.log('POST URL:', url);

  const response = await apiContext.post(url, { data: payload });
  console.log('Status:', response.status());

  let respJson = {};
  try { respJson = await response.json(); } 
  catch { console.log('No JSON returned or empty body'); }

  console.log('Response:', respJson);

  expect(response.status()).toBe(200);
  if (Object.keys(respJson).length) {
    expect(respJson).toHaveProperty('DocNum', 'JV25100001');
  }
});
