import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import Region from "@utils/data/uidata/loginData.json";

const region = Region.Region;

export default class ConnectExcel {
  constructor(sheetName, formName) {
    this.sheetName = sheetName;
    this.formName = formName;
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
    // if (driveId && itemId) {
    //   this.driveId = driveId;
    //   this.itemId = itemId;
    //   return; // skip file search , driveId = null, itemId = null
    // }
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
  async readExcel(column, isUI = true) {
    // Check if sheetName exist
    const sheetRes = await this.graphClient
      .api(
        `/drives/${this.driveId}/items/${this.itemId}/workbook/worksheets('${this.sheetName}')/usedRange()`
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
    const rowIndex = firstCol.indexOf(this.formName);
    if (rowIndex === -1) throw new Error(`Row "${this.formName}" not found`);

    return values[rowIndex][colIndex];
  }
}
