import { test } from "@playwright/test";
require("dotenv").config();
import Login from "../../uidata/loginData.json";

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

    // Input Login Data
    await test.step("Navigate to login page", () =>
      this.page.goto(Login.LaunchUrl));
    await test.step("Enter email", () =>
      this.emailInput.fill(process.env.TEST_USERNAME));
    await test.step("Enter password", () =>
      this.passwordInput.fill(process.env.TEST_PASSWORD));
    await test.step("Click first login", () => this.loginButton.click());
    await test.step(`Select client: ${region}`, () =>
      this.clientOption.selectOption(client));
    await test.step("Click final login", () => this.loginButton.click());
  }

  async navigateToForm(module, submodule, formName) {
    await test.step("Open Side Menu", () =>
      this.page.click("a#moduleMenuToggleBtn-2"));

    await test.step(`Navigate to ${formName}`, async () => {
      await this.page.getByRole("link", { name: ` ${module}` }).click();
      // If submodule exists, select it
      if (submodule) {
        await this.page
          .locator(`//a[@id='dropDown${module + submodule}']`)
          .click();
      }
      await this.page.locator(`//a[@id='side${formName}']`).click();
    });
  }
}
