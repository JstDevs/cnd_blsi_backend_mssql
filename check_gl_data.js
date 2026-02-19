const { sequelize } = require('./config/database');

async function checkData() {
    try {
        const results = await sequelize.query(`
            SELECT TOP 10 * FROM generalledger;
        `);
        console.log('General Ledger Data Sample:');
        console.log(JSON.stringify(results[0], null, 2));

        const count = await sequelize.query(`
            SELECT COUNT(*) as TotalRows FROM generalledger;
        `);
        console.log('Total Rows in generalledger:', count[0][0].TotalRows);
    } catch (err) {
        console.error('Error querying generalledger:', err);
    } finally {
        await sequelize.close();
    }
}

checkData();
