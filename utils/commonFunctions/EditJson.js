import fs from "fs";
import path from "path";

export default async function editJson(json, formName, value, isUi = true) {
  const jsonPath = path.resolve(json);
  const content = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  if (!isUi) {
    content.ID[`${formName.split(" ").join("")}`] = value;
  } else {
    content.DocNo[`${formName.split(" ").join("")}`] = value;
  }
  fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));
  return value;
}
