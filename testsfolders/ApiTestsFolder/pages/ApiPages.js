import {
  apiCall,
  setGlobal,
  handleJson,
} from "@ApiFolder/apiUtils/apiHelpers.js";

export default class ApiCallBase {
  constructor(api, url, formName, jsonPath = null) {
    this.api = api;
    this.url = url;
    this.formName = formName;
    this.jsonPath = jsonPath;
  }

  setUrl(newUrl) {
    this.url = newUrl;
  }

  async create(data, propMappings, expectedStatus = [200, 201]) {
    const { status, json } = await apiCall(
      this.api,
      "POST",
      this.url,
      { data },
      expectedStatus
    );

    return handleJson(
      this.formName, // used as globalName + in editJson
      json,
      status,
      this.jsonPath,
      propMappings // mapping for this form
    );
  }

  async getByKey(
    shouldHandleJson = false,
    propMappings = {},
    expectedStatus = [200]
  ) {
    const { status, json } = await apiCall(
      this.api,
      "GET",
      this.url,
      {},
      expectedStatus
    );

    if (shouldHandleJson) {
      const transformedJson = Array.isArray(json?.value)
        ? json.value[0] // ✅ Flatten the first row
        : json;

      return handleJson(
        this.formName,
        transformedJson,
        status,
        this.jsonPath,
        propMappings
      );
    }
    return { status, json }; // <-- fallback return
  }

  async getAll(expectedStatus = [200]) {
    return apiCall(this.api, "GET", this.url, {}, expectedStatus);
  }

  async update(
    method = "PUT",
    data,
    shouldHandleJson = false,
    propMappings = {},
    expectedStatus = [200, 204]
  ) {
    const { status, json } = await apiCall(
      this.api,
      method,
      this.url,
      { data },
      expectedStatus
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

  async delete(key, expectedStatus = [200, 204]) {
    return apiCall(this.api, "DELETE", this.url, {}, expectedStatus);
  }
}
