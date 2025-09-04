import { test } from "@playwright/test";
require("dotenv").config();
import Login from "@utils/data/uidata/loginData.json";

const region = Login.Region;
export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#loginEmail");
    this.passwordInput = page.locator("#loginPassword");
    this.clientOption = page.locator("#loginComboBoxClient");
    this.loginButton = page.locator("#login");
  }

  async login(module, submodule = null, formName) {
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
    await this.navigateToForm(module, submodule, formName);
  }

  async navigateToForm(module, submodule, formName) {
    await test.step("Open Side Menu", () =>
      this.page.click("a#moduleMenuToggleBtn-2"));

    await test.step(`Navigate to ${formName}`, async () => {
      if (module.includes(" ")) {
        await this.page.getByRole("link", { name: ` ${module}` }).click();
      } else {
        await this.page.getByRole("link", { name: module }).click();
      }
      // If submodule exists, select it
      if (submodule) {
        await this.page
          .locator(`//a[@id='dropDown${module + submodule}']`)
          .click();
      }
      await this.page.locator(`//a[@id='side${formName}']`).click();

      // Wait for loading
      await this.page
        .locator(".k-loading-image")
        .waitFor({ state: "detached" });

      await this.page.waitForTimeout(1500);
    });
  }
}
