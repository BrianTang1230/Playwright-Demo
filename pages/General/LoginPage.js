import { test } from "@playwright/test";
import Login from "../../data/loginData.json";

export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#loginEmail");
    this.passwordInput = page.locator("#loginPassword");
    this.clientOption = page.locator("#loginComboBoxClient");
    this.loginButton = page.locator("#login");
  }

  async login(region = "MY") {
    const client = region === "IND" ? Login.ClientIND : Login.Client;

    await test.step("Navigate to login page", () =>
      this.page.goto(Login.LaunchUrl));
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
