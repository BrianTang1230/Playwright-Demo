import SideMenuPage from "../pages/SideMenu";

export default async function getUiValues(page, values, type, delete) {
  const sideMenu = new SideMenuPage();

  if (type == "search") {
    // Uncheck Show Active Checkbox
    await page.getByRole("checkbox", { name: "Show Active Only" }).uncheck();

    // Search By Country Code
    await page.getByRole("textbox", { name: "Filter Item" }).fill(values[0]);

    // Select The Transaction
    await page.getByRole("gridcell", { name: `${values[0]}` }).click();

    // Click Edit Button to get UI values
    await sideMenu.btnEdit.click();
  }

  if (type == "filter") {
    // Fill in Filter
    }
    
    if (delete) {
        await 
    }
}
