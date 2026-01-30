const { sequelize } = require('./config/database');

async function investigate() {
    try {
        console.log('--- Document Types ---');
        const [docTypes] = await sequelize.query('SELECT ID, Name FROM documenttype WHERE ID IN (4, 5, 6, 14, 18, 19, 23, 27)');
        console.table(docTypes);

        console.log('\n--- Recent CTC Transactions ---');
        const [transactions] = await sequelize.query('SELECT ID, LinkID, DocumentTypeID, APAR, Status, InvoiceDate, Total, ContraAccountID FROM transactiontable WHERE DocumentTypeID IN (5, 27) ORDER BY CreatedDate DESC LIMIT 5');
        console.table(transactions);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

investigate();
