export async function loadExcelData(excel, sheet, form, isUI = true) {
  // Decide which columns to use based on test type
  const createCol = isUI ? "CreateData" : "CreateAPIData";
  const editCol = isUI ? "EditData" : "EditAPIData";

  // Read values from Excel
  const create = await excel.readExcel(sheet, form, createCol,isUI);
  const edit = await excel.readExcel(sheet, form, editCol,isUI);

  return {
    create: create.split(";"),
    edit: edit.split(";"),
  };
}
