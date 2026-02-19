const { sequelize } = require('./config/database');
const fs = require('fs');

async function getSPDefinition() {
    try {
        const results = await sequelize.query(`
            SELECT sm.definition
            FROM sys.sql_modules AS sm
            JOIN sys.objects AS o ON sm.object_id = o.object_id
            WHERE o.name = 'SP_GeneralLedger';
        `);
        if (results[0].length > 0) {
            fs.writeFileSync('sp_gl_definition.sql', results[0][0].definition);
            console.log('Definition saved to sp_gl_definition.sql');
        } else {
            console.log('SP_GeneralLedger not found in sys.sql_modules');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

getSPDefinition();
