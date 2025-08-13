import { test } from "@playwright/test";

export default class SideMenuPage {
  constructor(page) {
    this.page = page;
  }

  get sideMenuBar() {
    return this.page.locator("#moduleMenuToggleBtn-2").first();
  }

  get btnNew() {
    return this.page.locator("#btnNew");
  }

  get btnSave() {
    return this.page.locator("#btnSave");
  }

  get btnEdit() {
    return this.page.locator("#btnEdit");
  }

  get btnDelete() {
    return this.page.locator("#btnDelete");
  }

  get confirmDelete() {
    return this.page
      .locator("#btnMsgBoxYes")
      .filter({ has: this.page.locator(":visible") });
  }

  get rejectDelete() {
    return this.page.locator("#btnMsgBoxNo");
  }

  get btnAddNewItem() {
    return this.page.locator("#btnNewItem");
  }

  get successMessage() {
    return this.page.locator(".alert.alert-successs");
  }

  get errorMessage() {
    return this.page.locator("#divError");
  }

  get btnCreateNewForm() {
    return this.page.locator("#btnCreateNewForm");
  }

  get btnSaveRecord() {
    return this.page.locator("#btnSaveRecord");
  }

  get btnClose() {
    return this.page.locator("#btnClose");
  }
}

module.exports = SideMenuPage;
