export default async function SelectRecord(page, sideMenu, values, type, del) {
  if (type == "search") {
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
  }

  if (type == "filter") {
    // Fill in Filter
  }
}
