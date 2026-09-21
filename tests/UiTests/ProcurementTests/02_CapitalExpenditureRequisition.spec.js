// import { test, region } from "@utils/commonFunctions/GlobalSetup";
// import { allPhases } from "@utils/data/uidata/globalData.json";
// import LoginPage from "@UiFolder/pages/General/LoginPage";
// import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
// import editJson from "@utils/commonFunctions/EditJson";
// import {
//   checkLength,
//   setCurrForm,
//   setCurrPhase,
//   throwTestFailMsg,
// } from "@UiFolder/functions/comFuncs";
// import {
//   validateFormValues,
//   validateDBValues,
// } from "@UiFolder/functions/valuesFuncs";

// import { procurementSQLCommand } from "@UiFolder/queries/ProcurementQuery";
// import {
//   JsonPath,
//   InputPath,
//   DocNo,
// } from "@utils/data/uidata/procurementData.json";

// import {
//   CapitalExpenditureRequisitionCreate,
//   CapitalExpenditureRequisitionEdit1,
//   CapitalExpenditureRequisitionEdit2,
//   CapitalExpenditureRequisitionDelete,
// } from "@UiFolder/pages/Procurement/02_CapitalExpenditureRequisition";

// // ---------------- Set Global Variables ----------------
// let ou;
// let docNo;
// let sideMenu;
// let createValues;
// let editValues;
// let deleteSQL;
// const sheetName = "PROCUR_Data";
// const module = "Procurement";
// const submodule = null;
// const formName = "Capital Expenditure Requisition";
// const keyName = formName.split(" ").join("");
// const paths = InputPath[keyName + "Path"].split(",");
// const columns = InputPath[keyName + "Column"].split(",");

// test.describe.serial(`${formName} Tests`, () => {
//   region === "IND" && test.skip(true);
//   // ---------------- Before All ----------------
//   test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
//     await setCurrForm(formName);
//     await setCurrPhase(allPhases[phaseCount]);

//     // Load Excel values
//     [createValues, editValues, deleteSQL, ou] = await excel.loadExcelValues(
//       sheetName,
//       formName,
//     );

//     await checkLength(paths, columns, createValues, editValues);

//     docNo = DocNo[keyName];

//     console.log(`${"=".repeat(90)}\nStart Running: ${formName}`);
//   });

//   // ---------------- Before Each ----------------
//   test.beforeEach("Login and Navigation", async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.login(module, submodule, formName);
//     sideMenu = new SideMenuPage(page);
//     await sideMenu.sideMenuBar.waitFor();
//   });

//   // ---------------- Create Test ----------------
//   test(`Create ${formName}`, async ({ page, db }) => {
//     await db.deleteData(deleteSQL, { DocNo: docNo, OU: ou[0] });

//     const { uiVals, gridVals } = await CapitalExpenditureRequisitionCreate(
//       page,
//       sideMenu,
//       paths,
//       columns,
//       createValues,
//       ou,
//     );

//     docNo = await editJson(
//       JsonPath,
//       formName,
//       await page.locator("#txtQRFNum").inputValue(),
//     );

//     const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
//       DocNo: docNo,
//     });

//     const gridDbValues = await db.retrieveGridData(
//       procurementGridSQLCommand(formName),
//       {
//         DocNo: docNo,
//       },
//     );

//     const gridDbColumns = Object.keys(gridDbValues[0]);

//     await validateFormValues(createValues, columns, uiVals);
//     await validateDBValues(
//       [...createValues, ou],
//       [...columns, "OU"],
//       dbValues[0],
//     );
//     await validateGridValues(gridCreateValues.join(";").split(";"), gridVals);
//     await validateDBValues(
//       gridCreateValues.join(";").split(";"),
//       gridDbColumns,
//       gridDbValues[0],
//     );
//   });

//   // ---------------- Edit Test ----------------
//   test("Edit Capital Expenditure Requisition", async ({ page, db }) => {
//     const { uiVals, gridVals } = await CapitalExpenditureRequisitionEdit(
//       page,
//       sideMenu,
//       paths,
//       columns,
//       createValues,
//       editValues,
//       gridPaths,
//       gridEditValues,
//       cellsIndex,
//       ou,
//       docNo,
//     );

//     const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
//       DocNo: docNo,
//     });

//     const gridDbValues = await db.retrieveGridData(
//       procurementGridSQLCommand(formName),
//       {
//         DocNo: docNo,
//       },
//     );

//     const gridDbColumns = Object.keys(gridDbValues[0]);

//     await validateFormValues(editValues, columns, uiVals);
//     await validateDBValues(
//       [...editValues, ou],
//       [...columns, "OU"],
//       dbValues[0],
//     );
//     await validateGridValues(gridEditValues.join(";").split(";"), gridVals);
//     await validateDBValues(
//       gridEditValues.join(";").split(";"),
//       gridDbColumns,
//       gridDbValues[0],
//     );
//   });

//   // ---------------- Delete Test ----------------
//   test("Delete Capital Expenditure Requisition", async ({ page, db }) => {
//     await CapitalExpenditureRequisitionDelete(
//       page,
//       sideMenu,
//       createValues,
//       ou,
//       docNo,
//     );

//     const dbValues = await db.retrieveData(procurementSQLCommand(formName), {
//       DocNo: docNo,
//     });

//     if (dbValues.length > 0) {
//       throw new Error(`Deleting ${formName} failed`);
//     }
//   });

//   // ---------------- After All ----------------
//   test.afterAll(async ({ db }) => {
//     await editJson(JsonPath, formName, "");
//     console.log(`End Tests Running: ${formName}\n${"=".repeat(90)}`);
//   });
// });
