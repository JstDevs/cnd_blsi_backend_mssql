const { sequelize } = require('./config/database');
const fs = require('fs');

async function listTables() {
    try {
        const results = await sequelize.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE';
        `);
        fs.writeFileSync('db_tables.json', JSON.stringify(results[0], null, 2));
        console.log('Tables listed in db_tables.json');
    } catch (err) {
        console.error('Error listing tables:', err);
    } finally {
        await sequelize.close();
    }
}

listTables();
