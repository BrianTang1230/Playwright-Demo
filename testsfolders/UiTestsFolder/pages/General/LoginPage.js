import { test } from "@utils/commonFunctions/GlobalSetup";
import { allure } from "allure-playwright";
require("dotenv").config();
import Login from "@utils/data/uidata/loginData.json";
import { runStep } from "@UiFolder/functions/comFuncs";

const region = process.env.REGION || Login.Region;

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
    await runStep("Navigate to login page", () =>
      this.page.goto(Login.LaunchUrl)
    );
    await runStep("Enter email", () =>
      this.emailInput.fill(process.env.TEST_USERNAME)
    );
    await runStep("Enter password", () =>
      this.passwordInput.fill(process.env.TEST_PASSWORD)
    );
    await runStep("Click first login", () => this.loginButton.click());
    await runStep(`Select client: ${region}`, () =>
      this.clientOption.selectOption(client)
    );
    await runStep("Click final login", () => this.loginButton.click());
    await this.navigateToForm(module, submodule, formName);
  }

  async navigateToForm(module, submodule, formName) {
    await runStep("Open Side Menu", () =>
      this.page.click("a#moduleMenuToggleBtn-2")
    );

    await runStep(`Navigate to ${formName}`, async () => {
      await this.page.locator(`//a[@id='side${module}']`).first().click();

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
        .first()
        .waitFor({ state: "detached" });

      await this.page.waitForTimeout(1500);
    });
  }
}
