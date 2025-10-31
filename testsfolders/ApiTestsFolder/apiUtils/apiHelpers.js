import { expect, request } from "@playwright/test";
import editJson from "@utils/commonFunctions/EditJson";

export async function handleApiResponse(
  response,
  expectedStatus = []
) {
  const status = response.status();

  // Read response once
  const rawBody = await response.text();

  // Try parsing JSON
  let res;
  try {
    res = JSON.parse(rawBody);
  } catch {
    res = null;
  }

  if (status === 204 || !rawBody || rawBody.trim() === "") {
    console.log("📩 No content (success)");
  } else if (res) {
    console.log("📩 JSON response:", res);
  } else {
    console.log("📩 Raw response:", rawBody);
  }


  // Determine what counts as success
  // const isExpected =
  //   expectedStatus?.length > 0
  //     ? expectedStatus.includes(status)
  //     : status >= 200 && status < 300;
  const isExpected = expectedStatus.includes(status);

  if (!isExpected) {
    console.error("❌ Unexpected status:", status);
    console.error("❌ Error:", res?.message || rawBody);
  }

  return { status, rawBody, json: res };
}

export async function setGlobal(globalName, json, propMappings) {
  // propMappings is an object like { key: "PRcvKey", num: "PRcvNum", other: "OtherField" }

  const globalObj = {};

  for (const [alias, propName] of Object.entries(propMappings)) {
    const value = json[propName];

    // Apply parseInt only if value looks like a number (optional, up to you)
    globalObj[alias] =
      value !== undefined && value !== null
        ? typeof value === "string" && /^\d+$/.test(value)
          ? parseInt(value)
          : value
        : undefined;
  }

  globalThis[globalName] = globalObj;

  // return destructured for local use
  return globalObj;
}

export async function apiCall(
  api,
  method,
  url,
  options = {},
  expectedStatus
) {
  const response = await api[method.toLowerCase()](url, {
    ...options,
  });

  const { status, json, rawBody } = await handleApiResponse(
    response,
    expectedStatus
  );
  // 🔑 If it's a positive test (2xx expected) → fail hard
  if (expectedStatus.some((s) => s >= 200 && s < 300)) {
    expect(expectedStatus).toContain(status); // will throw if wrong
  }

  return { status, json, rawBody };
}

export async function handleJson(
  formName,
  json,
  status,
  JsonPath,
  propMappings
) {
  if (json) {
    const values = await setGlobal(formName, json, propMappings);

    editJson(JsonPath, formName, values, false);

    return { ...values, status, json };
  }
  return { status, json };
}
