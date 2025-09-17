export async function checkLength(paths, columns, createValues, editValues) {
  if (
    paths.length !== columns.length &&
    columns.length !== createValues.length &&
    createValues.length !== editValues.length
  ) {
    console.error(paths, columns, createValues, editValues);
    throw new Error("Paths, columns, and values do not match in length.");
  }
}
