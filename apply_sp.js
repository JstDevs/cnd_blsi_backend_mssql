const { sequelize } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function applySP() {
    try {
        const spPath = path.join(__dirname, 'db/StoredProcedures/SP_GeneralLedger.sql');
        let spSql = fs.readFileSync(spPath, 'utf8');

        console.log('Read SP from:', spPath);

        // Clean up DELIMITER stuff which is for CLI usually
        spSql = spSql.replace(/DELIMITER \$\$/g, '');
        spSql = spSql.replace(/DELIMITER ;/g, '');
        spSql = spSql.split('$$');

        for (let statement of spSql) {
            statement = statement.trim();
            if (statement) {
                console.log('Executing statement starting with:', statement.substring(0, 50));
                await sequelize.query(statement);
            }
        }

        console.log('SP_GeneralLedger applied successfully!');

    } catch (err) {
        console.error('Error applying SP:', err);
    } finally {
        if (sequelize) await sequelize.close();
    }
}

applySP();
