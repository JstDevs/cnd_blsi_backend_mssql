const { sequelize } = require('./config/database');
const fs = require('fs');

async function checkBeginningBalance() {
    try {
        const count = await sequelize.query(`SELECT COUNT(*) as Count FROM beginningbalance;`);

        const result = {
            beginningbalance_count: count[0][0].Count
        };

        if (count[0][0].Count > 0) {
            const sample = await sequelize.query(`SELECT TOP 5 * FROM beginningbalance;`);
            result.sample = sample[0];
        }

        fs.writeFileSync('bb_counts.json', JSON.stringify(result, null, 2));
        console.log('Results saved to bb_counts.json');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

checkBeginningBalance();
