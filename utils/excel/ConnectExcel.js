import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { ClientCredentials } from "../data/clientCredentials.json";

export default class ConnectExcel {
  constructor() {
    // initialize GraphClient
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const credential = new ClientSecretCredential(
            ClientCredentials.tenantId,
            ClientCredentials.clientId,
            ClientCredentials.clientSecret
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
  async init(isUI = true, region) {
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
  }

  // Read Excel data function
  async readExcel(sheet, row, column, isUI = true) {
    // Check if sheetName exist
    const sheetRes = await this.graphClient
      .api(
        `/drives/${this.driveId}/items/${this.itemId}/workbook/worksheets('${sheet}')/usedRange()`
      )
      .get();

    const values = sheetRes.values;
    if (!values || values.length == 0) return [];

    // Find column index
    const headerRow = values[0];
    const colIndex = headerRow.indexOf(column);
    if (colIndex === -1) throw new Error(`Column "${column}" not found`);

    // Find row index
    const firstColIndex = isUI ? 1 : 0; // Check what is the test type
    const firstCol = values.map((r) => r[firstColIndex]);
    const rowIndex = firstCol.indexOf(row);
    if (rowIndex === -1) throw new Error(`Row "${row}" not found`);

    return values[rowIndex][colIndex];
  }

  async writeExcel(sheet, row, column, newValue) {
    // Get the sheet data
    const sheetRes = await this.graphClient
      .api(
        `/drives/${this.driveId}/items/${this.itemId}/workbook/worksheets('${sheet}')/usedRange()`
      )
      .get();

    const values = sheetRes.values;
    if (!values || values.length === 0)
      throw new Error(`Sheet "${sheet}" is empty`);

    // Find column index
    const headerRow = values[0];
    const colIndex = headerRow.indexOf(column);
    if (colIndex === -1) throw new Error(`Column "${column}" not found`);

    // Always use first column (API case)
    const firstCol = values.map((r) => r[0]);
    const rowIndex = firstCol.indexOf(row);
    if (rowIndex === -1) throw new Error(`Row "${row}" not found`);

    // Convert column index to Excel letter
    const colLetter = String.fromCharCode(65 + colIndex); // 65 = 'A'
    const cellAddress = `${colLetter}${rowIndex + 1}`;

    // Update the cell
    await this.graphClient
      .api(
        `/drives/${this.driveId}/items/${this.itemId}/workbook/worksheets('${sheet}')/range(address='${cellAddress}')`
      )
      .patch({
        values: [[newValue]],
      });

    return `Updated ${column} at row ${row} with value: ${newValue}`;
  }
}
