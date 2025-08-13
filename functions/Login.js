import { test } from "@playwright/test";
import Login from "../data/loginData.json";

export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#loginEmail");
    this.passwordInput = page.locator("#loginPassword");
    this.clientOption = page.locator("#loginComboBoxClient");
    this.loginButton = page.locator("#login");
  }

  async login(region = "MY") {
    const client = region === "IND" ? LoginData.ClientIND : LoginData.Client;

    await test.step("Navigate to login page", () =>
      this.page.goto(LoginData.LaunchUrl));
    await test.step("Enter email", () =>
      this.emailInput.fill(Login.LoginEmail));
    await test.step("Enter password", () =>
      this.passwordInput.fill(Login.LoginPassword));
    await test.step("Click first login", () => this.loginButton.click());
    await test.step(`Select client: ${region}`, () =>
      this.clientOption.selectOption(client));
    await test.step("Click final login", () => this.loginButton.click());
  }
}

// export default async function login(page, region = "MY") {
//   await page.goto(Login.LaunchUrl);
//   await page.evaluate(() => document.documentElement.requestFullscreen());

//   // Fill in required data
//   await page.fill("input#loginEmail", Login.LoginEmail);
//   await page.fill("input#loginPassword", Login.LoginPassword);
//   await page.click("button#login");

//   // Define Client and DataSource based on Region
//   let client = Login.Client;
//   let dataSource = Login.DataSources;

//   if (region !== "MY") {
//     client = Login.ClientIND;
//     dataSource = Login.DataSourceIND;
//   }

//   await page.selectOption("select#loginComboBoxClient", client);

//   await page.click("button#login");

//   // Wait for Navbar is visible
//   await page.waitForSelector("a#moduleMenuToggleBtn-2", { status: "visible" });

//   return page;
// }
