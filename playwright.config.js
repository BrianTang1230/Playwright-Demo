// @ts-check
// require("module-alias/register");
require("module-alias/register");
import { defineConfig, devices } from "@playwright/test";
import Login from "./utils/data/uidata/loginData.json";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
const region = process.env.REGION || Login.Region; // ✅ HERE

const device = { ...devices["Desktop Chrome"] };
// @ts-ignore
delete device.deviceScaleFactor;
/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright"],
  ] /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */,

  timeout: 240000,
  expect: { timeout: 10000 },

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    baseURL: "https://qa.quarto.cloud",
    extraHTTPHeaders: {
      Origin: "https://qa.quarto.cloud",
    },
    headless: false, // true in CI, false locally
    video: {
      mode: process.env.CI ? "retain-on-failure" : "on", // or "retain-on-failure"
      size: { width: 1920, height: 1080 }, // video resolution
    },
    screenshot: "on",
    actionTimeout: 60000,
    launchOptions: {
      args: process.env.CI ? [] : ["--start-maximized"], // skip maximize on CI
    },
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null, // fixed size in CI
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "off",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "API Tests",
      testDir: "tests/APITests",
      use: {
        ...device,
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        video: { mode: "on", size: { width: 1920, height: 1080 } },
        screenshot: "on",
        headless: false,
        launchOptions: {
          args: process.env.CI ? [] : ["--start-maximized"],
          slowMo: 1300,
        },
      },
    },
    {
      name: "UI Tests",
      testDir: "tests/UiTests",
      testIgnore: [
        "tests/UiTests/FFBProcurementTests/**", // Temporarily ignore FFBProcurementTests
        ...(region === "IND"
          ? [
              "tests/UiTests/LabTests/**",
              "tests/UiTests/FFBProcurementTests/MY/**",
            ]
          : []),
        ...(region === "MY"
          ? ["tests/UiTests/FFBProcurementTests/IND/**"]
          : []),
      ], // IND side ignore Lab tests temporarily
      use: {
        ...device,
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        video: { mode: "on", size: { width: 1920, height: 1080 } },
        screenshot: "on",
        headless: !!process.env.CI,
        browserName: "chromium",
        channel: process.env.BROWSER || "chrome",
        launchOptions: {
          args: process.env.CI ? [] : ["--start-maximized"],
          slowMo: 1200,
        },
      },
    },
    // {
    //   name: "chromium",
    //   use: {
    //     ...device,
    //     viewport: null,
    //     launchOptions: {
    //       args: ["--start-maximized"],
    //       slowMo: 1000,
    //     },
    //     headless: false,
    //   },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
