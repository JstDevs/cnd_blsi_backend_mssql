const { sequelize } = require('./config/database');
const fs = require('fs');

async function test() {
    try {
        const p_accountCode = '1-01-01-010';
        const p_fundID = '1';
        const p_cutoff = '2026-01-31';

        console.log(`Final Test: code=${p_accountCode}, fund=${p_fundID}, cutoff=${p_cutoff}`);

        const results = await sequelize.query(
            'CALL SP_GeneralLedger(:accountCode, :fundID, :cutoff)',
            {
                replacements: {
                    accountCode: p_accountCode,
                    fundID: p_fundID,
                    cutoff: p_cutoff
                }
            }
        );

        const debugInfo = {
            isArray: Array.isArray(results),
            length: results.length,
            data: results
        };
        fs.writeFileSync('debug_results_final.json', JSON.stringify(debugInfo, null, 2));
        console.log('Final results dumped');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (sequelize) await sequelize.close();
    }
}

test();
