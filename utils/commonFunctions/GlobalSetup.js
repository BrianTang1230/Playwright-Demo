import { test as base, request } from "@playwright/test";
import DBHelper from "@UiFolder/pages/General/DBHelper";
import ConnectExcel from "@utils/excel/ConnectExcel";
import { handleApiResponse } from "@ApiFolder/apiUtils/apiHelpers";
require("dotenv").config();
import Login from "@utils/data/uidata/loginData.json";

export const region = process.env.REGION || Login.Region;

// UI-only browser signals stay scoped to a single Playwright test.
const uiFailureContexts = new WeakMap();
const MAX_UI_FAILURE_SIGNALS = 10;

function safeDiagnosticText(value, maxLength = 600) {
  return String(value ?? "")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(
      /(\b(?:password|passwd|pwd|token|access_token|refresh_token|client_secret|authorization)\b["']?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;}]+)/gi,
      "$1[REDACTED]",
    )
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .slice(0, maxLength);
}

function safeUiUrl(value) {
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith(".quarto.cloud")) return "";
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return "";
  }
}

function addUiFailureSignal(testInfo, signal) {
  const context = uiFailureContexts.get(testInfo);
  if (!context) return;
  if (context.signals.length >= MAX_UI_FAILURE_SIGNALS) context.signals.shift();
  context.signals.push(signal);
}

function serializeErrorChain(error) {
  const chain = [];
  let current = error;
  let depth = 0;
  while (current && depth < 5) {
    chain.push({
      name: safeDiagnosticText(current.name || "Error", 100),
      message: safeDiagnosticText(current.message || current),
      stack: safeDiagnosticText(current.stack || "", 3000),
      ...(current.failureCode ? { failureCode: current.failureCode } : {}),
      ...(current.formName
        ? { formName: safeDiagnosticText(current.formName, 200) }
        : {}),
      ...(current.phase
        ? { phase: safeDiagnosticText(current.phase, 100) }
        : {}),
      ...(current.uiStep
        ? { uiStep: safeDiagnosticText(current.uiStep, 200) }
        : {}),
      ...(current.side ? { side: safeDiagnosticText(current.side, 100) } : {}),
      ...(current.reason
        ? { reason: safeDiagnosticText(current.reason, 100) }
        : {}),
    });
    current = current.cause;
    depth += 1;
  }
  return chain;
}

export const test = base.extend({
  // Attach bounded browser diagnostics only when a UI test requests `page`.
  // API tests do not request this fixture and therefore do not launch a browser.
  page: async ({ page }, use, testInfo) => {
    if (testInfo.project.name === "UI Tests") {
      const context = {
        page,
        signals: [],
      };
      uiFailureContexts.set(testInfo, context);

      page.on("pageerror", (error) => {
        addUiFailureSignal(testInfo, {
          type: "pageerror",
          message: safeDiagnosticText(error?.message || error),
        });
      });

      page.on("console", (message) => {
        if (message.type() !== "error") return;
        addUiFailureSignal(testInfo, {
          type: "console_error",
          message: safeDiagnosticText(message.text()),
        });
      });

      page.on("requestfailed", (request) => {
        const errorText = request.failure()?.errorText || "Request failed";
        // Navigation cancellations are expected in some flows and add little value.
        if (errorText.includes("ERR_ABORTED")) return;
        const url = safeUiUrl(request.url());
        if (!url) return;
        addUiFailureSignal(testInfo, {
          type: "request_failed",
          method: request.method(),
          url,
          message: safeDiagnosticText(errorText, 300),
        });
      });

      page.on("response", (response) => {
        if (response.status() < 400) return;
        const request = response.request();
        const url = safeUiUrl(response.url());
        if (!url) return;
        addUiFailureSignal(testInfo, {
          type: "http_error_response",
          method: request.method(),
          status: response.status(),
          url,
        });
      });
    }

    await use(page);
  },
  db: [
    async ({}, use) => {
      const db = new DBHelper();
      await db.connect();
      await use(db);
      await db.closeAll();
    },
    { scope: "worker" },
  ],
  excel: [
    async ({}, use) => {
      const excel = new ConnectExcel();
      await excel.init();
      await use(excel);
    },
    { scope: "worker" },
  ],
  api: async ({}, use) => {
    const authContext = await request.newContext();

    const response = await authContext.post(
      "https://qaappgw.quarto.cloud/zmasterapi/token",
      {
        form: {
          grant_type: "password",
          client_id: process.env.TEST_CLIENTID,
          username: process.env.TEST_USERNAME,
          medium_type: "web",
          password: process.env.TEST_PASSWORD,
        },
      },
    );

    const body = await response.json();
    if (!body.access_token) throw new Error("❌ Failed to get token");
    await authContext.dispose();

    // Now create a context with token pre-injected
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${body.access_token}`,
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },
});

test.beforeAll(async ({}, testInfo) => {
  const now = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    hour12: false,
  });

  console.log(`[${now}] Start: ${testInfo.titlePath.join(" > ")}`);
});

// Attach local diagnostics for failed UI tests without changing their outcome.
test.afterEach(async ({}, testInfo) => {
  const context = uiFailureContexts.get(testInfo);
  try {
    if (testInfo.project.name !== "UI Tests") return;
    if (testInfo.status !== "failed" && testInfo.status !== "timedOut") return;
    if (testInfo.retry < testInfo.project.retries) return;

    const pageEvidence = { url: "", title: "" };
    try {
      if (context?.page && !context.page.isClosed()) {
        pageEvidence.url = safeUiUrl(context.page.url()) || "[unavailable]";
        pageEvidence.title = safeDiagnosticText(
          await context.page.title(),
          300,
        );
      }
    } catch {
      pageEvidence.url ||= "[unavailable]";
      pageEvidence.title ||= "[unavailable]";
    }

    const diagnostics = {
      test: {
        title: safeDiagnosticText(testInfo.title, 500),
        file: testInfo.file,
        project: testInfo.project.name,
        status: testInfo.status,
        retry: testInfo.retry,
      },
      page: pageEvidence,
      errors: (testInfo.errors || []).slice(0, 5).map(serializeErrorChain),
      browserSignals: context?.signals || [],
    };

    try {
      await testInfo.attach("ui-failure-diagnostics.json", {
        body: Buffer.from(JSON.stringify(diagnostics, null, 2)),
        contentType: "application/json",
      });
    } catch (attachError) {
      console.warn(
        "UI failure diagnostics could not be attached:",
        attachError?.message || String(attachError),
      );
    }
  } catch (diagnosticsError) {
    console.warn(
      "UI failure diagnostics could not be collected:",
      diagnosticsError?.message || String(diagnosticsError),
    );
  } finally {
    uiFailureContexts.delete(testInfo);
  }
});
