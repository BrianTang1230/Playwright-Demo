import fs from "fs";
import path from "path";

export default async function editJson(json, formName, value) {
  const jsonPath = path.resolve(json);
  const content = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  content.ID[`${formName}ID`] = value;
  fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));
  return value;
}
