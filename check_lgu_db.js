const db = require('./config/database');

async function checkLguTable() {
    try {
        console.log('--- LGU COLUMNS ---');
        const [cols] = await db.sequelize.query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'lgu'");
        if (cols.length === 0) {
            console.log('Table lgu does not exist or has no columns.');
        } else {
            cols.forEach(c => console.log(`${c.COLUMN_NAME}: ${c.DATA_TYPE}`));
        }

        console.log('\n--- DATA CHECK ---');
        const [data] = await db.sequelize.query("SELECT COUNT(*) as count FROM lgu");
        console.log(JSON.stringify(data, null, 2));

        console.log('\n--- IDENTITY CHECK ---');
        const [ident] = await db.sequelize.query("SELECT IDENT_SEED('lgu') AS Seed, IDENT_INCR('lgu') AS Increment, COLUMNPROPERTY(OBJECT_ID('lgu'), 'ID', 'IsIdentity') AS IsIdentity");
        console.log(JSON.stringify(ident, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLguTable();
