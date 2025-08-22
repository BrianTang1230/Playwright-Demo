import { expect } from "@playwright/test";
import { test } from "../../../../testsfolders/apiUtils/Fixtures.js";
import ConnectExcel from "@utils/excel/ConnectExcel";
import { NUR_API_URL } from "../../../../testsfolders/ApiTestsFolder/ApiUrl.json";
import handleApiResponse from "../../../../testsfolders/apiUtils/apiHelpers.js";

test.describe.serial("Nursery API", () => {
  let prcvKey;
  let connectExcel;
  let createValues;
  let editValues;

  const url = NUR_API_URL;
  const sheetName = "NURAPI_Data";
  const formName = "Pre Nursery Seed Received";

  test.beforeAll(async () => {
    // Initialize Excel connection
    connectExcel = new ConnectExcel();
    await connectExcel.init(false);

    // Read Excel data once
    createValues = (
      await connectExcel.readExcel(sheetName, formName, "CreateAPIData", false)
    ).split(";");
    editValues = (
      await connectExcel.readExcel(sheetName, formName, "EditAPIData", false)
    ).split(";");
  });

  test("Add new Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const response = await request.post(`${url}/nur/api/NurPRcvPost`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        PRcvKey: 59,
        PRcvNum: "",
        RcvDate: "2025-08-20T05:20:23.176Z",
        RefNo: createValues[0],
        PlantSourceKey: 3,
        PlantSourceCode: "",
        PlantSourceDesc: "",
        PlantSourceCodeDesc: "",
        RcvQty: 12.0,
        Remarks: createValues[1],
        NurBatchKey: 138,
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "",
        Status: "O",
        StatusDesc: "OPEN",
        OrdQty: createValues[2],
        DelQty: createValues[3],
        DamQty: createValues[4],
        FocQty: createValues[5],
        ClientKey: 0,
        OUKey: 16,
        OUCode: "",
        OUDesc: "",
        OUCodeOUDesc: "",
        CompKey: 0,
        PInterOUTrnKey: 0,
        IsTransferFromInterPre: false,
        CreatedBy: 6,
        CreatedByCode: "123123",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-20T13:20:39.2148344",
        LastUpdatedBy: 6,
        LastUpdatedDate: "2025-08-20T05:20:39.2148344Z",
        LastUpdatedByCode: "123123",
        LastUpdatedByDesc: "lmsupport",
        RowState: 1,
      },
    });

    const { status, json } = await handleApiResponse(response);

    expect([200, 201]).toContain(status);

    if (json) {
      prcvKey = parseInt(json.PRcvKey);

      // // 🔥 Save PRcvKey back into Excel (e.g., into "Key" column for this formName)
      // await connectExcel.writeExcel(
      //   sheetName, // Sheet name
      //   formName, // Row identifier (TestCaseName column)
      //   "Key", // Column to update
      //   prcvKey // Value to write
      // );
    }
  });

  test("Get Nursery Seed Received transaction by HdrKey", async ({
    request,
    authToken,
  }) => {
    const response = await request.get(
      `${url}/nur/odata/NurPRcv?HdrKey=${prcvKey}&$format=json`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );
    console.log(await response.json());
    expect(response.status()).toBe(200);
  });

  test("Get all Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const response = await request.get(
      `${url}/nur/odata/NurPRcv?$format=json&$orderby=RcvDate%20desc,PRcvKey&$select=PRcvKey,RefNo,PlantSourceDesc,StatusDesc,OUCode,NurBatchCodeDesc,OrdQty,DelQty,DamQty,RcvQty,FocQty,Remarks,RcvDate,PRcvNum,CreatedByCode&%24inlinecount=allpages&%24format=json&%24top=20&%24filter=(OUCode%20eq%20%27PMCE%27%20and%20(RcvDate%20ge%20datetime%272025-08-01T00%3A00%3A00%27%20and%20RcvDate%20le%20datetime%272025-08-31T00%3A00%3A00%27))`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );
    console.log(await response.json());
    expect(response.status()).toBe(200);
  });

  test("Update Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const response = await request.post(`${url}/nur/api/NurPRcvPost`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        PRcvKey: `${prcvKey}`,
        PRcvNum: "",
        RcvDate: "2025-08-20T05:20:23.176Z",
        RefNo: editValues[0],
        PlantSourceKey: 3,
        PlantSourceCode: "",
        PlantSourceDesc: "",
        PlantSourceCodeDesc: "",
        RcvQty: 12.0,
        Remarks: editValues[1],
        NurBatchKey: 138,
        NurBatchCode: "",
        NurBatchDesc: "",
        NurBatchCodeDesc: "",
        Status: "O",
        StatusDesc: "OPEN",
        OrdQty: editValues[2],
        DelQty: editValues[3],
        DamQty: editValues[4],
        FocQty: editValues[5],
        ClientKey: 0,
        OUKey: 16,
        OUCode: "",
        OUDesc: "",
        OUCodeOUDesc: "",
        CompKey: 0,
        PInterOUTrnKey: 0,
        IsTransferFromInterPre: false,
        CreatedBy: 6,
        CreatedByCode: "123123",
        CreatedByDesc: "lmsupport",
        CreatedDate: "2025-08-20T13:20:39.2148344",
        LastUpdatedBy: 6,
        LastUpdatedDate: "2025-08-20T05:20:39.2148344Z",
        LastUpdatedByCode: "123123",
        LastUpdatedByDesc: "lmsupport",
        RowState: 2,
      },
    });

    console.log(
      response.status() === 204
        ? "Update successful (no content returned)"
        : await response.json()
    );

    expect([200, 204]).toContain(response.status());
  });

  test("Delete Pre Nursery Seed Received transaction", async ({
    request,
    authToken,
  }) => {
    const response = await request.delete(
      `${url}/nur/api/nurPRcvPost?key=${prcvKey}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );

    console.log(
      response.status() === 204
        ? "Delete successful (no content returned)"
        : await response.json()
    );

    expect([200, 204]).toContain(response.status());
  });
});
