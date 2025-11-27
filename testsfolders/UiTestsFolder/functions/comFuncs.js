export async function checkLength(paths, columns, createValues, editValues) {
  if (
    paths.length !== columns.length ||
    columns.length !== createValues.length ||
    createValues.length !== editValues.length
  ) {
    console.error(
      paths,
      paths.length,
      columns,
      columns.length,
      createValues,
      createValues.length,
      editValues,
      editValues.length
    );
    throw new Error("Paths, columns, and values do not match in length.");
  }
}

export async function SelectOU(page, inputPath, dropdownPath, ou) {
  await page.locator(inputPath).click();
  await page.locator(dropdownPath, { hasText: ou }).first().click();

  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
}
