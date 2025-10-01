import fs from "fs";
import path from "path";

export default async function editJson(json, formName, value, isUi = true) {
  if (value === null) throw new Error("Value to write in JSON is null");
  if (value === "") throw new Error("Value to write in JSON is empty");
  const jsonPath = path.resolve(json);
  let content;

  try {
    const data = fs.readFileSync(jsonPath, "utf-8");
    content = JSON.parse(data);
  } catch (err) {
    console.error("Read or parse JSON failed:", err);
    throw err;
  }

  const key = formName.split(" ").join("");
  if (!isUi) {
    content.ID[key] = {
      ...(content.ID[key] || {}),
      ...value,
    };
  } else {
    content.DocNo[key] = value;
  }

  try {
    // create a temp file
    const tempPath = jsonPath + ".tmp";
    fs.writeFileSync(tempPath, JSON.stringify(content, null, 2));
    fs.renameSync(tempPath, jsonPath);
  } catch (err) {
    console.error("Write JSON failed:", err);
    throw err;
  }

  return value;
}
