import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import Region from "@utils/data/uidata/loginData.json";

const region = process.env.REGION || Region.Region;

export default class ConnectExcel {
  constructor() {
    this.values = [];
    // initialize GraphClient
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const credential = new ClientSecretCredential(
            process.env.TENANT_ID,
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
          );
          const token = await credential.getToken(
            "https://graph.microsoft.com/.default"
          );
          return token.token;
        },
      },
    });
  }

  // async initialize function
  async init(isUI = true) {
    // Get site
    this.site = await this.graphClient
      .api("/sites/lintramaxmy.sharepoint.com:/sites/SQA-Team")
      .get();

    let docName;

    // Check what is the test type and choose the file based on testType
    if (isUI) {
      // MY is default region for UI testing, but if selectedRegion is IND then use IND
      const selectedRegion = region || "MY";
      docName =
        selectedRegion === "MY"
          ? "SeleniumTestData_MY.xlsx"
          : "SeleniumTestData_IND.xlsx";
    } else {
      // if its API testing it will run Playwright_API.xlsx
      docName = "Playwright_API.xlsx";
    }

    // Find files
    const files = await this.graphClient
      .api(`/sites/${this.site.id}/drive/root/search(q='${docName}')`)
      .get();

    this.driveId = files.value[0].parentReference.driveId;
    this.itemId = files.value[0].id;
    console.log(`Excel: ${docName} setup done`);
  }

  // Read Excel data function
  async readExcel(formName, column, isUI = true) {
    // Find column index
    const headerRow = this.values[0];
    const colIndex = headerRow.indexOf(column);
    if (colIndex === -1) throw new Error(`Column "${column}" not found`);

    // Find row index
    const firstColIndex = isUI ? 1 : 0; // Check what is the test type
    const firstCol = this.values.map((r) => r[firstColIndex]);
    const rowIndex = firstCol.indexOf(formName);
    if (rowIndex === -1) throw new Error(`Row "${formName}" not found`);

    return this.values[rowIndex][colIndex];
  }

  async loadExcelValues(
    sheetName,
    formName,
    { isUI = true, hasOU = true, hasGrid = false, hasTree = false } = {}
  ) {
    let columns = isUI
      ? ["CreateData", "EditData", "DeleteSQL"]
      : ["CreaetAPIData", "EditAPIData"];
    let data = [];

    // Check if sheetName exist
    const sheetRes = await this.graphClient
      .api(
        `/drives/${this.driveId}/items/${this.itemId}/workbook/worksheets('${sheetName}')/usedRange()`
      )
      .get();

    this.values = sheetRes.values;
    if (!this.values || this.values.length == 0) return this.values;

    if (hasOU) {
      columns.push("OperatingUnit");
    }

    if (hasGrid) {
      columns.push("GridDataCreate");
      columns.push("GridDataEdit");
    }

    if (hasTree) {
      columns.push("TreeViewDataCreate");
      columns.push("TreeViewDataEdit");
      columns.push("TreeViewDataChecker");
    }

    for (let col = 0; col < columns.length; col++) {
      let value;
      if (
        columns[col] === "GridDataCreate" ||
        columns[col] === "GridDataEdit"
      ) {
        value = (await this.readExcel(formName, columns[col], isUI)).split("|");
      } else if (columns[col] === "DeleteSQL") {
        value = await this.readExcel(formName, columns[col], isUI);
      } else {
        value = (await this.readExcel(formName, columns[col], isUI)).split(";");
      }
      data.push(value);
    }

    return data;
  }
}
