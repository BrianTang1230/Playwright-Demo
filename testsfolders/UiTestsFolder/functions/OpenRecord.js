export async function SelectRecord(page, sideMenu, values, action = "edit") {
  // Click Show Active Checkbox
  action === "edit" &&
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
  if (action === "edit" || action === "reopen") await sideMenu.btnEdit.click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
}

/* 
    3 Criterias and Fixed OU & Date - when need to use document number or typing keyword
    //![Default](../../../utils/images/UQF_Default.png)


    Dropdown - when need to use dropdown selection
    //![Dropdown](../../../utils/images/UQF_Dropdown.png)


    Directly - directly apply filter with only OU and Date
    //![Directly](../../../utils/images/UQF_Directly.png)
*/

export async function FilterTransactionBy1AndMoreCriterias(
  page,
  ou,
  keywords = [],
  filterColumns = [],
  inputKeywordsWith = [],
) {
  // Input OU and Date
  await page
    .locator('input[name="comboBoxCompulSearchParam_input"]')
    .first()
    .fill(ou);

  if (keywords.length > 0) {
    for (let i = 0; i < keywords.length; i++) {
      // Add filter criteria and select filter column
      await page.getByRole("button", { name: "+", exact: true }).click();
      await page
        .locator("#tabstrip-2")
        .getByText("Choose a Column to Filter")
        .nth(i + 1)
        .click();
      await page
        .locator("#ddlColumn_listbox li", { hasText: filterColumns[i] })
        .nth(i + 1)
        .click();

      // Input Keyword
      const paramInput =
        inputKeywordsWith[i] === "Typing"
          ? page.locator("[name='searchParam']").nth(i)
          : inputKeywordsWith[i] === "Dropdown"
            ? page.locator("[name='comboBoxSearchParam_input']").nth(i)
            : page.getByRole("spinbutton");

      if (inputKeywordsWith[i] === "Numeric") {
        await paramInput.press("Control+a");
      }

      await paramInput.type(keywords[i]);

      if (inputKeywordsWith[i] === "Dropdown") {
        await page
          .locator("#comboBoxSearchParam_listbox li", { hasText: keywords[i] })
          .first()
          .waitFor({ state: "visible" });
        await paramInput.press("Enter");
      }
    }
  }

  // Apply filter and open seleted transaction
  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(keywords.at(-1).slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500); //Wait 1.5s to prevent slow loading in some forms
}

export async function FilterTransactionBy2And1Criterias(
  page,
  date,
  ou,
  keyword,
  filterColumn,
  inputKeywordWith = "Typing",
) {
  // Input OU and Date
  await page
    .locator('input[name="comboBoxCompulSearchParam_input"]')
    .first()
    .fill(ou);
  await page.getByRole("combobox").nth(3).fill(date);
  const secondDateInput = page.getByRole("combobox").nth(4);
  (await secondDateInput.isVisible()) && (await secondDateInput.fill(date));

  // Add filter criteria and select filter column
  await page.getByRole("button", { name: "+", exact: true }).click();
  await page
    .locator("#tabstrip-2")
    .getByText("Choose a Column to Filter")
    .nth(2)
    .click();
  await page
    .locator("#ddlColumn_listbox li", { hasText: filterColumn })
    .nth(2)
    .click();

  // Input Keyword
  const paramInput =
    inputKeywordWith === "Typing"
      ? page.locator("[name='searchParam']").nth(1)
      : page.locator("[name='comboBoxSearchParam_input']");
  await paramInput.type(keyword);

  if (inputKeywordWith === "Dropdown") {
    await page
      .locator("#comboBoxSearchParam_listbox li", { hasText: keyword })
      .first()
      .waitFor({ state: "visible" });
    await paramInput.press("Enter");
  }

  // Apply filter and open seleted transaction
  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(keyword.slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500); //Wait 1.5s to prevent slow loading in some forms
}

export async function FilterRecordByOUAndDate(
  page,
  values,
  ou,
  keyword,
  times = 1,
  type = "Default",
) {
  const date = values[0];
  await page
    .locator('input[name="comboBoxCompulSearchParam_input"]')
    .first()
    .fill(ou);
  await page.getByRole("combobox").nth(3).fill(date);
  await page.getByRole("button", { name: "+", exact: true }).click();
  await page.getByRole("combobox").nth(4).fill(date);

  if (type !== "Directly") {
    const seletor = await page
      .locator("#tabstrip-2")
      .getByText("Choose a Column to Filter")
      .nth(2);
    await seletor.click();
    for (let i = 0; i < times; i++) {
      await seletor.press("ArrowDown");
    }
    await seletor.press("Enter");

    if (type === "Default") {
      await page.getByRole("textbox").fill(keyword);
    } else if (type === "Dropdown") {
      const paramInput = page.locator("[name='comboBoxSearchParam_input']");
      await paramInput.type(keyword);
      await page
        .locator("#comboBoxSearchParam_listbox li", { hasText: keyword })
        .first()
        .waitFor({ state: "visible" });
      await paramInput.press("Enter");
    }
  }

  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(keyword.slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
}

export async function FilterRecordByDateRange(
  page,
  dates,
  ou,
  keyword,
  kewordInputPath,
) {
  await page.locator("#FromDate").first().fill(dates[0]);
  await page.locator("#ToDate").first().fill(dates[1]);
  let ouBox = await page.locator('[name="OUCode_input"]').first();
  if (ouBox !== null) {
    await page.locator('[name="OUCode_input"]').first().type(ou);
  }
  await page.locator(kewordInputPath).fill(keyword);

  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(keyword.slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
}

export async function FilterRecordByOU(
  page,
  date,
  ou,
  keyword,
  times = [1, 1],
) {
  await page
    .locator('input[name="comboBoxCompulSearchParam_input"]')
    .first()
    .fill(ou);
  await page.getByRole("button", { name: "+", exact: true }).click();

  const seletor = await page
    .locator("#tabstrip-2")
    .getByText("Choose a Column to Filter")
    .nth(1);
  await seletor.click();
  for (let i = 0; i < times[0]; i++) {
    await seletor.press("ArrowDown");
  }
  await seletor.press("Enter");

  await page.getByRole("combobox").nth(4).fill(date);

  await page.getByRole("button", { name: "+", exact: true }).click();

  const seletor2 = await page
    .locator("#tabstrip-2")
    .getByText("Choose a Column to Filter")
    .nth(2);
  await seletor2.click();
  for (let i = 0; i < times[1]; i++) {
    await seletor2.press("ArrowDown");
  }
  await seletor2.press("Enter");

  const paramInput = page.locator("[name='comboBoxSearchParam_input']").nth(-1);
  await paramInput.type(keyword);
  await page
    .locator("#comboBoxSearchParam_listbox li", { hasText: keyword })
    .first()
    .waitFor({ state: "visible" });
  await paramInput.press("Enter");

  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(keyword.slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
}

export async function FilterForUnsaveChecking(page, keyword) {
  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(keyword.slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();

  // Wait for loading
  await page.locator(".k-loading-image").first().waitFor({ state: "detached" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

export async function FilterRecordByFiscalYearAndPeriod(
  page,
  fiscalYear,
  period,
  docNo,
) {
  const yearInput = page.locator("input.k-textbox.filter-input:visible").nth(0);
  await yearInput.fill(fiscalYear);
  await yearInput.press("Tab");

  const periodInput = page
    .locator("input.k-textbox.filter-input:visible")
    .nth(1);
  await periodInput.fill(period);
  await page.getByRole("button", { name: "+", exact: true }).last().click();

  const fieldDropdown = page
    .locator("#tabstrip-2")
    .getByText("Choose a Column to Filter")
    .nth(2);
  await fieldDropdown.click();
  await page
    .locator("#ddlColumn_listbox li", { hasText: "Doc. No." })
    .last()
    .click();

  const docInput = page.locator('input[name="searchParam"]:visible').last();

  await docInput.click();
  await docInput.type(docNo, { delay: 50 });
  await docInput.press("Tab");

  await page.getByRole("button", { name: "  Apply Filter" }).click();
  await page
    .getByRole("gridcell", { name: new RegExp(docNo.slice(0, 4)) })
    .first()
    .click();
  await page.getByRole("button", { name: "   Open Transaction" }).click();
}
