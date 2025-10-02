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

export async function FilterRecord(page, values, ou, keyword, times = 1) {
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

  await page.getByRole("textbox").fill(keyword);
  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page.getByRole("gridcell", { name: keyword }).click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}
