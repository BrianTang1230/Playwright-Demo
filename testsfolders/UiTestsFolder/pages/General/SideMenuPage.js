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

  get btnPopulate() {
    return this.page.locator("#btnPopulate").first();
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
    await this.page.locator("#btnDelete,#btnDelate").first().click();
    await this.confirmBtn.click();
    await this.page
      .locator(".k-loading-image")
      .first()
      .waitFor({ state: "detached" });
  }

  get confirmBtn() {
    return this.page
      .locator("#btnMsgBoxYes")
      .filter({ has: this.page.locator(":visible") });
  }

  get rejectBtn() {
    return this.page
      .locator("#btnMsgBoxNo")
      .filter({ has: this.page.locator(":visible") });
  }

  get btnAddNewItem() {
    return this.page
      .locator(
        "#btnNewItem,#btnCreateNew,#btnCreate,#btnNewPRW,#btnNewDet,#btnNewSB",
      )
      .first();
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

  async clickBtnClose() {
    await this.page.locator("#btnClose").click();
  }
}

module.exports = SideMenuPage;
