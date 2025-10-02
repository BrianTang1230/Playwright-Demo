export async function SelectRecord(page, sideMenu, values, del = false) {
  // Click Show Active Checkbox
  !del &&
    (await page
      .getByRole("checkbox", {
        name: "Show Active Only",
      })
      .click());

  // Search By Country Code
  await page.getByRole("textbox", { name: "Filter Item" }).fill(values[0]);

  // Select The Transaction
  await page.getByRole("gridcell", { name: `${values[0]}` }).click();

  // Verification
  !del && (await sideMenu.btnEdit.click());

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

/* 
  type:
      DN - use document number
      
 */
export async function FilterRecordByOU(
  page,
  values,
  ou,
  keyword,
  times = 1,
  type = "DN"
) {
  await page
    .locator('input[name="comboBoxCompulSearchParam_input"]')
    .first()
    .fill(ou);
  await page.getByRole("button", { name: "+", exact: true }).click();
  await page.getByRole("combobox").nth(3).fill(values[0]);
  await page.getByRole("combobox").nth(4).fill(values[0]);

  const seletor = await page
    .locator("#tabstrip-2")
    .getByText("Choose a Column to Filter")
    .nth(2);
  await seletor.click();
  for (let i = 0; i < times; i++) {
    await seletor.press("ArrowDown");
  }
  await seletor.press("Enter");

  if (type === "DN") {
    await page.getByRole("textbox").fill(keyword);
  } else if (type === "OT") {
    await page.locator("[name='comboBoxSearchParam_input']").type(keyword);
  }

  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page.getByRole("gridcell", { name: keyword }).click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}

export async function FilterRecordByDateRange(page, values, ou, keyword) {
  await page.locator("#FromDate").first().fill(values[0]);
  await page.locator("#ToDate").first().fill(values[1]);
  await page.locator('[name="OUCode_input"]').first().type(ou);
  await page.locator("#prnum").fill(keyword);

  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page.getByRole("gridcell", { name: keyword }).click();
  await page
    .getByRole("button", { name: "   Open Transaction" })
    .first()
    .click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}
