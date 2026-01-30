const { sequelize } = require('./config/database');

async function testSP() {
    try {
        const linkID = '64353680';
        console.log(`--- Testing SP_GeneralLedger for LinkID: ${linkID} ---`);

        const results = await sequelize.query(
            'CALL SP_GeneralLedger(?, ?, ?, ?)',
            {
                replacements: ['%', '%', '2026-12-31', linkID],
            }
        );

        console.log(`Rows returned: ${results.length}`);
        if (results.length > 0) {
            results.forEach((row, i) => {
                console.log(`Row ${i + 1}: ID=${row.id}, AP/AR=${row.ap_ar}, Item=${row.ledger_item}, Code=${row.account_code}, Debit=${row.debit}, Credit=${row.credit}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

testSP();
