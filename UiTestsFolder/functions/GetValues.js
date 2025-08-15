import GetElementByPath from "./GetElementByPath";

async function getUiValues(page, paths) {
  const uiValues = [];
  for (let i = 0; i < paths.length; i++) {
    const inputPath = await GetElementByPath(page, paths[i]);

    // if checkbox
    if ((await inputPath.getAttribute("type")) === "checkbox") {
      const isChecked = await inputPath.isChecked();
      isChecked ? uiValues.push("True") : uiValues.push("False");
    } else {
      const inputValue = await inputPath.inputValue();
      if (inputValue === "") {
        uiValues.push("NA");
      } else {
        uiValues.push(inputValue.trim());
      }
    }
  }
  return uiValues;
}

module.exports = { getUiValues };
