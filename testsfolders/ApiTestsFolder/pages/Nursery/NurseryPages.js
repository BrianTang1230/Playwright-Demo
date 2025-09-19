import {
  apiCall,
  setGlobal,
  handleJson,
} from "@ApiFolder/apiUtils/apiHelpers.js";
import { JsonPath } from "@utils/data/apidata/nurseryApiData.json";

export default class NurseryApi {
  constructor(api, url, formName = "Pre Nursery Seed Received") {
    this.api = api;
    this.url = url;
    this.formName = formName;
  }

  async create(data, propMappings) {
    const { status, json } = await apiCall(
      this.api,
      "POST",
      this.url,
      { data },
      [200, 201]
    );

    return handleJson(
      this.formName, // used as globalName + in editJson
      json,
      status,
      JsonPath,
      propMappings // mapping for this form
    );
  }

  async getByKey() {
    return apiCall(this.api, "GET", this.url, {}, [200]);
  }

  async getAll() {
    return apiCall(this.api, "GET", this.url, {}, [200]);
  }

  async update(data) {
    return apiCall(this.api, "POST", this.url, { data }, [200, 204]);
  }

  async delete(key) {
    return apiCall(this.api, "DELETE", this.url, {}, [204]);
  }
}