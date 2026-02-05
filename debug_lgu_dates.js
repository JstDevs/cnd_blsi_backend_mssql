const db = require('./config/database');

async function checkSchemas() {
    try {
        const tables = ['region', 'subdepartment'];
        for (const table of tables) {
            console.log(`\n--- ${table.toUpperCase()} COLUMNS ---`);
            const [cols] = await db.sequelize.query(`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
            cols.forEach(c => console.log(`${c.COLUMN_NAME}: ${c.DATA_TYPE}`));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchemas();
