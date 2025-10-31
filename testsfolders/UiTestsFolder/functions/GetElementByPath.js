export default async function GetElementByPath(page, path) {
  let element;
  // If path starts with # or //, use .locator directly
  if (path.startsWith("#") || path.startsWith("//")) {
    element = page.locator(path).first();
  }

  // If path does not start with # or // and includes *, use .getByRole
  else if (path.includes("*")) {
    let role = path.split("*");

    // If role[1] is not a number lets find the element by name, else find by index
    if (role[1] || role[1].trim() !== "") {
      if (isNaN(Number(role[1]))) {
        element = page.getByRole(role[0], { name: role[1] });
      } else element = page.getByRole(role[0]).nth(Number(role[1]));
    }
  } else {
    // If path does not start with any symbols, use .locator with name
    element = page.locator(`[name='${path}']`);
  }
  return element;
}
