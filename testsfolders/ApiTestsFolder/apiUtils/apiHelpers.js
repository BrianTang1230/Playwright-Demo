import { expect } from "@playwright/test";

export async function handleApiResponse(response, expectedStatus = null) {
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

  // Log in a nicer format
  if (status === 204 || !rawBody || rawBody.trim() === "") {
    console.log("📩 No content (success)");
  } else if (res) {
    console.log("📩 JSON response:", res);
  } else {
    console.log("📩 Raw response:", rawBody);
  }

  // Determine what counts as success
  const isExpected =
    expectedStatus?.length > 0
      ? expectedStatus.includes(status)
      : status >= 200 && status < 300;

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
  request,
  method,
  url,
  token,
  options = {},
  expectedStatus = [200]
) {
  const response = await request[method.toLowerCase()](url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });

  const { status, json, rawBody } = await handleApiResponse(response);

  expect(expectedStatus).toContain(status);

  return { status, json, rawBody };
}

