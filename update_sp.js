const { sequelize } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function updateSP() {
    try {
        const sqlPath = path.join(__dirname, 'db/StoredProcedures/SP_GeneralLedger.sql');
        let sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Dropping existing procedure...');
        await sequelize.query('DROP PROCEDURE IF EXISTS SP_GeneralLedger');

        console.log('Parsing SQL file...');
        // Remove all DELIMITER lines
        const lines = sql.split('\n');
        const filteredLines = lines.filter(line => !line.trim().startsWith('DELIMITER'));
        let cleanSql = filteredLines.join('\n');

        // Replace all $$ with empty string (usually at end of procedure and end of file)
        cleanSql = cleanSql.replace(/\$\$/g, '');

        // Find the CREATE PROCEDURE statement
        const createIndex = cleanSql.indexOf('CREATE PROCEDURE');
        if (createIndex === -1) {
            throw new Error('Could not find CREATE PROCEDURE in SQL file.');
        }

        let createStmt = cleanSql.substring(createIndex).trim();

        console.log('Creating updated procedure...');
        await sequelize.query(createStmt);

        console.log('✅ Stored Procedure updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating SP:', error.message);
        if (error.original) {
            console.error('Original Error:', error.original.sqlMessage);
        }
        process.exit(1);
    }
}

updateSP();
