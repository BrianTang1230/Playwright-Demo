import sql from "mssql";
import DB from "@utils/data/apidata/loginData.json";

// 1. Create a single, direct configuration object.
// No more multi-region logic is needed.
const dbConfig = {
  user: DB.UserID,
  password: DB.Password,
  server: DB.DataSourceMY.DataSource,
  port: DB.DataSourceMY.Port,
  database: DB.DataSourceMY.Database,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export default class DBHelper {
  constructor() {
    // 2. The helper now only needs to manage one connection pool.
    this.pool = null;
  }

  async connect() {
    if (!this.pool) {
      this.pool = await new sql.ConnectionPool(dbConfig).connect();
      console.log(`✅ Connected to ${dbConfig.database} for API testing`);
    }
    return this.pool;
  }

  setParams(request, params) {
    for (const key in params) {
      // This simple version assumes integer params.
      // You can expand this if you need other types like strings (sql.NVarChar).
      request.input(key, sql.Int, params[key]);
    }
  }

  async execute(query, params = {}) {
    const pool = await this.connect();
    const request = pool.request();
    this.setParams(request, params);
    return await request.query(query);
  }

  async retrieveData(query, params = {}) {
    const result = await this.execute(query, params);
    return result.recordset;
  }

  async deleteData(query, params = {}) {
    await this.execute(query, params);
  }

  async closeAll() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log(`Closed connection to ${dbConfig.database}`);
    }
  }
}