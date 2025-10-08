// Due to the "Staff Loan/Deposit Maintenance" form having issues with grid, the whole test file is skipped for now.

// import { test } from "@utils/commonFunctions/GlobalSetup";
// import LoginPage from "@UiFolder/pages/General/LoginPage";
// import SideMenuPage from "@UiFolder/pages/General/SideMenuPage";
// import editJson from "@utils/commonFunctions/EditJson";
// import { checkLength } from "@UiFolder/functions/comFuncs";
// import {
//   ValidateUiValues,
//   ValidateDBValues,
//   ValidateGridValues,
// } from "@UiFolder/functions/ValidateValues";

// import { payrollSQLCommand } from "@UiFolder/queries/PayrollQuery";
// import {
//   InputPath,
//   JsonPath,
//   DocNo,
//   GridPath,
// } from "@utils/data/uidata/payrollData.json";
// import { payrollGridSQLCommand } from "@UiFolder/queries/PayrollQuery";

// import {
//   StaffLoanDepositMaintenanceCreate,
//   StaffLoanDepositMaintenanceEdit,
//   //   StaffLoanDepositMaintenanceDelete,
// } from "@UiFolder/pages/Payroll/StaffLoanDepositMaintenance";
// import Login from "@utils/data/uidata/loginData.json";

// // ---------------- Set Global Variables ----------------
// let ou;
// let sideMenu;
// let createValues;
// let editValues;
// let deleteSQL;
// let gridCreateValues;
// let gridEditValues;
// const sheetName = "PR_Data";
// const module = "Payroll";
// const submodule = "Miscellaneous";
// const formName = "Staff Loan/Deposit Maintenance";
// const keyName = "StaffLoanDepositMaintenance";
// const paths = InputPath[keyName + "Path"].split(",");
// const columns = InputPath[keyName + "Column"].split(",");
// const gridPaths = GridPath[keyName + "Grid"].split(",");
// const cellsIndex = [[1], [1, 4, 6]];

// test.describe.serial("Staff Loan/Deposit Maintenance Tests", () => {
//   // ---------------- Before All ----------------
//   test.beforeAll("Setup Excel, DB, and initial data", async ({ db, excel }) => {
//     if (Login.Region === "IND") test.skip(true);

//     // Load Excel values
//     [
//       createValues,
//       editValues,
//       deleteSQL,
//       ou,
//       gridCreateValues,
//       gridEditValues,
//     ] = await excel.loadExcelValues(sheetName, formName, { hasGrid: true });

//     await checkLength(paths, columns, createValues, editValues);

//     console.log(`Start Running: ${formName}`);
//   });

//   // ---------------- Before Each ----------------
//   test.beforeEach("Login and Navigation", async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.login(module, submodule, formName);
//     sideMenu = new SideMenuPage(page);
//     await sideMenu.sideMenuBar.waitFor();
//   });

//   // ---------------- Create Test ----------------
//   test("Create Staff Loan/Deposit Maintenance", async ({ page, db }) => {
//     await db.deleteData(deleteSQL, {
//       Date: createValues[0],
//       RecType: createValues[1],
//       OU: ou[0],
//     });

//     const { uiVals, gridVals } = await StaffLoanDepositMaintenanceCreate(
//       page,
//       sideMenu,
//       paths,
//       columns,
//       createValues,
//       gridPaths,
//       gridCreateValues,
//       cellsIndex,
//       ou
//     );

//     const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
//       Date: createValues[0],
//       RecType: createValues[1],
//       OU: ou[0],
//     });

//     const gridDbValues = await db.retrieveGridData(
//       payrollGridSQLCommand(formName),
//       {
//         Date: createValues[0],
//         RecType: createValues[1],
//         OU: ou[0],
//       }
//     );

//     const gridDbColumns = Object.keys(gridDbValues[0]);

//     await ValidateUiValues(createValues, columns, uiVals);
//     await ValidateDBValues(
//       [...createValues, ou],
//       [...columns, "OU"],
//       dbValues[0]
//     );
//     await ValidateGridValues(gridCreateValues.join(";").split(";"), gridVals);
//     await ValidateDBValues(
//       gridCreateValues.join(";").split(";"),
//       gridDbColumns,
//       gridDbValues[0]
//     );
//   });

//   // ---------------- Edit Test ----------------
//   test("Edit Staff Loan/Deposit Maintenance", async ({ page, db }) => {
//     const { uiVals, gridVals } = await StaffLoanDepositMaintenanceEdit(
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
//       gridCreateValues[0] // need to add keyword to identify the record
//     );
//     const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
//       Date: createValues[0],
//       RecType: createValues[1],
//       OU: ou[0],
//     });

//     const gridDbValues = await db.retrieveGridData(
//       payrollGridSQLCommand(formName),
//       {
//         Date: createValues[0],
//         RecType: createValues[1],
//         OU: ou[0],
//       }
//     );

//     const gridDbColumns = Object.keys(gridDbValues[0]);

//     await ValidateUiValues(editValues, columns, uiVals);
//     await ValidateDBValues(
//       [...editValues, ou],
//       [...columns, "OU"],
//       dbValues[0]
//     );
//     await ValidateGridValues(gridEditValues.join(";").split(";"), gridVals);
//     await ValidateDBValues(
//       gridEditValues.join(";").split(";"),
//       gridDbColumns,
//       gridDbValues[0]
//     );
//   });

//   //   // ---------------- Delete Test ----------------
//   //   test("Delete Staff Loan/Deposit Maintenance", async ({ page, db }) => {
//   //     await StaffIncomeDeclarationDelete(
//   //       page,
//   //       sideMenu,
//   //       createValues,
//   //       ou,
//   //       gridEditValues[0]
//   //     );

//   //     const dbValues = await db.retrieveData(payrollSQLCommand(formName), {
//   //       Date: createValues[0],
//   //       RecType: createValues[1],
//   //       OU: ou[0],
//   //     });

//   //     if (dbValues.length > 0) {
//   //       throw new Error(`Deleting ${formName} failed`);
//   //     }
//   //   });

//   //   // ---------------- After All ----------------
//   //   test.afterAll(async ({ db }) => {
//   //     console.log(`End Running: ${formName}`);
//   //   });
// });
