import sql from "mssql";
import DB from "@utils/data/uidata/loginData.json";

const region = process.env.REGION || DB.Region;

const configs = {
  dbMY: {
    user: DB.UserID,
    password: DB.Password,
    server: DB.DataSourceMY.DataSource,
    port: DB.DataSourceMY.Port,
    database: DB.DataSourceMY.Database,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  dbIND: {
    user: DB.UserID,
    password: DB.Password,
    server: DB.DataSourceIND.DataSource,
    port: DB.DataSourceIND.Port,
    database: DB.DataSourceIND.Database,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
};

export default class DBHelper {
  constructor() {
    this.pools = {};
    this.region = region; // ✅ store region
    this.dbName = `db${region}`;
  }

  async connect() {
    if (!this.pools[this.dbName]) {
      this.pools[this.dbName] = await new sql.ConnectionPool(
        configs[this.dbName]
      ).connect();
      console.log(`✅ Connected to ${configs[this.dbName].database}`);
    }
    return this.pools[this.dbName];
  }

  setParams(request, params) {
    for (const key in params) {
      request.input(key, params[key]);
    }
  }

  async execute(query, params = {}) {
    const pool = await this.connect();
    const request = pool.request();

    // ✅ Only add Region if the query actually references @Region
    if (query.includes("@region") && !params.Region) {
      params.Region = this.region;
    }

    this.setParams(request, params);
    return await request.query(query);
  }

  async retrieveData(query, params = {}) {
    const result = await this.execute(query, params);
    return result.recordset;
  }

  async retrieveGridData(query, params = {}) {
    const result = await this.execute(query, params);
    return result.recordset;
  }

  async deleteData(query, params = {}) {
    await this.execute(query, params);
  }

  async closeAll() {
    for (const key in this.pools) {
      await this.pools[key].close();
      delete this.pools[key];
    }
    console.log(`Closed ${configs[this.dbName].database}`);
  }
}
