import sql from "mssql";
import { masterGridSqlCommand, masterSQLCommand } from "./MasterQuery";
import DB from "../uidata/loginData.json";

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
  constructor(region = "MY") {
    this.pools = {};
    this.dbName = `db${region}`;
  }

  async connect() {
    if (!this.pools[this.dbName]) {
      this.pools[this.dbName] = await new sql.ConnectionPool(
        configs[this.dbName]
      ).connect();
      console.log(`✅ Connected to ${this.dbName}`);

      const result = await this.pools[this.dbName].request().query(`
      SELECT DB_NAME() AS CurrentDB, SERVERPROPERTY('MachineName') AS ServerName, USER_NAME() AS CurrentUser
    `);
      console.table(result.recordset);

      const schemaResult = await this.pools[this.dbName].request().query(`
      SELECT SCHEMA_NAME() AS DefaultSchema
    `);
      console.table(schemaResult.recordset);
    }
    return this.pools[this.dbName];
  }

  setParams(request, params) {
    for (const key in params) {
      request.input(key, params[key]);
    }
  }

  async retrieveData(formName, params = {}) {
    const pool = await this.connect();
    const request = pool.request();
    this.setParams(request, params);

    const query = masterSQLCommand(formName);
    const result = await request.query(query);
    return result.recordset;
  }

  async retrieveGridData(formName, params = {}) {
    const pool = await this.connect();
    const request = pool.request();
    this.setParams(request, params);

    const query = masterGridSqlCommand(formName);
    const result = await request.query(query);
    return result.recordset;
  }

  async deleteData(query, params = {}) {
    const pool = await this.connect();
    const request = pool.request();
    this.setParams(request, params);

    await request.query(query);
  }

  async closeAll() {
    for (const key in this.pools) {
      await this.pools[key].close();
      delete this.pools[key];
    }
  }
}
