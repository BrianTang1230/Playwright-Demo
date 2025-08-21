import { ClientCredentials } from "../../../utils/data/clientCredentials.json";

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
  if (res) {
    console.log("📩 JSON response:", JSON.stringify(res, null, 2)); // pretty JSON
  } else {
    console.log("📩 Raw response:", rawBody); // fallback if not JSON
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

export async function pickExcelFile() {
  return new Promise((resolve, reject) => {
    OneDrive.open({
      clientId: ClientCredentials.clientId,
      action: "query", // Query metadata only
      multiSelect: false,
      advanced: {
        filter: ".xlsx",
        scopes: "Files.ReadWrite.Selected",
      },
      success: function (files) {
        const file = files.value[0];
        resolve({
          driveId: file.parentReference.driveId,
          itemId: file.id,
        });
      },
      cancel: function () {
        reject(new Error("User cancelled the picker"));
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}
