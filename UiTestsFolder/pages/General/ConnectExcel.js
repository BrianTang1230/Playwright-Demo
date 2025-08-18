import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { ClientCredentials } from "../../data/clientCredentials.json";

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
  async init(region = "MY") {
    // Get site
    this.site = await this.graphClient
      .api("/sites/lintramaxmy.sharepoint.com:/sites/SQA-Team")
      .get();

    // Determine document name based on region
    const docName =
      region === "MY"
        ? "SeleniumTestData_MY.xlsx"
        : "SeleniumTestData_IND.xlsx";

    // Find files
    const files = await this.graphClient
      .api(`/sites/${this.site.id}/drive/root/search(q='${docName}')`)
      .get();

    this.driveId = files.value[0].parentReference.driveId;
    this.itemId = files.value[0].id;
  }

  // Read Excel data function
  async readExcel(sheet, row, column) {
    const sheetRes = await this.graphClient
      .api(
        `/drives/${this.driveId}/items/${this.itemId}/workbook/worksheets('${sheet}')/usedRange()`
      )
      .get();

    const values = sheetRes.values;
    if (!values || values.length === 0) return [];

    // Find column index
    const headerRow = values[0];
    const colIndex = headerRow.indexOf(column);
    if (colIndex === -1) throw new Error(`Column "${column}" not found`);

    // Find row index
    const firstCol = values.map((r) => r[1]);
    const rowIndex = firstCol.indexOf(row);
    if (rowIndex === -1) throw new Error(`Row "${row}" not found`);

    return values[rowIndex][colIndex];
  }
}
