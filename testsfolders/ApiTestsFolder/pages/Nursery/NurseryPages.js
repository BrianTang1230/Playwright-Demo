import {
  apiCall,
  setGlobal,
  handleJson,
} from "@ApiFolder/apiUtils/apiHelpers.js";

export default class NurseryApi {
  constructor(api, url, formName, jsonPath = null) {
    this.api = api;
    this.url = url;
    this.formName = formName;
    this.jsonPath = jsonPath;
  }

  setUrl(newUrl) {
    this.url = newUrl;
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
      this.jsonPath,
      propMappings // mapping for this form
    );
  }

  async getByKey() {
    return apiCall(this.api, "GET", this.url, {}, [200]);
  }

  async getAll() {
    return apiCall(this.api, "GET", this.url, {}, [200]);
  }

  async update(
    method = "PUT",
    data,
    shouldHandleJson = false,
    propMappings = {}
  ) {
    const { status, json } = await apiCall(
      this.api,
      method,
      this.url,
      { data },
      [200, 204]
    );

    if (shouldHandleJson) {
      return handleJson(
        this.formName, // used as globalName + in editJson
        json,
        status,
        this.jsonPath,
        propMappings // mapping for this form
      );
    }
    return { status, json }; // <-- fallback return
  }

  async delete(key, silent = false) {
    return apiCall(this.api, "DELETE", this.url, {}, [204], silent);
  }
}
