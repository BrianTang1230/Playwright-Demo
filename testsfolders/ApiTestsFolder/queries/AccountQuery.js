import DBHelper from '../pages/DBHelper';

/**
 * Executes a SQL script to completely delete a Bank Payment transaction and its related data.
 * @param {number} transHdrKey The primary key of the transaction to delete.
 */
async function deleteBankPaymentById(transHdrKey) {
  if (!transHdrKey || typeof transHdrKey !== 'number') {
    throw new Error('A valid numeric TransHdrKey must be provided.');
  }

  // Create an instance of helper class
  const dbHelper = new DBHelper();

  // SQL script.
  const cleanupSQL = `
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Step 1 & 2: Delete from tables that depend on FIN_TransDet
        DELETE FROM [dbo].[FIN_TransDet_APAR] WHERE TransDetKey IN (SELECT TransDetKey FROM [dbo].[FIN_TransDet] WHERE TransHdrKey = @TransHdrKey);
        DELETE FROM [dbo].[FIN_BankBulkPymtDet] WHERE TransDetKey IN (SELECT TransDetKey FROM [dbo].[FIN_TransDet] WHERE TransHdrKey = @TransHdrKey);
        
        -- Step 3: Delete from child table that depends directly on FIN_TransHdr
        DELETE FROM [dbo].[FIN_TransDetBC] WHERE TransHdrKey = @TransHdrKey;

        -- Step 4: Delete the detail records
        DELETE FROM [dbo].[FIN_TransDet] WHERE TransHdrKey = @TransHdrKey;

        -- Step 5: Finally, delete the main header record
        DELETE FROM [dbo].[FIN_TransHdr] WHERE TransHdrKey = @TransHdrKey;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
  `;

  try {
    console.log(`Executing cleanup script for TransHdrKey: ${transHdrKey}...`);
    // Use the deleteData method from helper
    await dbHelper.deleteData(cleanupSQL, { TransHdrKey: transHdrKey });
    console.log(`Successfully executed cleanup for TransHdrKey: ${transHdrKey}.`);
  } catch (err) {
    console.error(`SQL cleanup failed for TransHdrKey ${transHdrKey}:`, err);
    throw err; // Re-throw the error so the calling test will fail
  } finally {
    // Always ensure the connection is closed after the operation
    await dbHelper.closeAll();
  }
}

// Export the function to make it available in test files
export {
  deleteBankPaymentById
};