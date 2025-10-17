export default class SideMenuPage {
  constructor(page) {
    this.page = page;
  }

  get sideMenuBar() {
    return this.page.locator("#moduleMenuToggleBtn-2").first();
  }

  get btnNew() {
    return this.page.locator("#btnNew").first();
  }

  async clickBtnSave(isDblClick = false) {
    const saveBtn = this.page.locator("#btnSave").first();

    if (isDblClick) {
      await saveBtn.dblclick();
    } else {
      await saveBtn.click();
    }

    await this.page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
  }

  get btnEdit() {
    return this.page.locator("#btnEdit").first();
  }

  async clickBtnDelete() {
    await this.page.locator("#btnDelete").first().click();
    await this.confirmDelete.click();
    await this.page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
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
    return this.page.locator('#btnNewItem, #btnCreateNew').first();
  }

  get btnEditItem() {
    return this.page.locator("#btnEditItem").first();
  }

  get successMessage() {
    return this.page.locator(".alert.alert-successs");
  }

  get errorMessage() {
    return this.page.locator("#divError");
  }

  async clickBtnCreateNewForm() {
    await this.page.locator("#btnCreateNewForm").click();
    await this.page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
  }

  get btnSaveRecord() {
    return this.page.locator("#btnSaveRecord");
  }

  get btnClose() {
    return this.page.locator("#btnClose");
  }
}

module.exports = SideMenuPage;
