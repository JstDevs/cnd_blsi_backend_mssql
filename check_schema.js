const db = require('./config/database');

async function checkSchema() {
    try {
        const [results] = await db.sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'documenttype'
    `);
        console.log('--- documenttype Schema ---');
        console.log(JSON.stringify(results, null, 2));

        const [categories] = await db.sequelize.query(`SELECT ID, Name FROM [documenttypecategory]`);
        console.log('--- Categories ---');
        console.log(JSON.stringify(categories, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
