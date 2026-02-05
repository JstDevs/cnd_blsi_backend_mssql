const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    port: parseInt(process.env.DB_PORT, 10),
    dialectOptions: { options: { trustServerCertificate: true, encrypt: false } },
    logging: console.log // Enable logging
});

const SubDepartment = require('./models/subDepartment')(sequelize, DataTypes);

async function debugSubDept() {
    try {
        console.log('--- Debugging SubDepartment Insert with Logging ---');
        await SubDepartment.create({
            Code: 'SUB-DEBUG',
            Name: 'Debug Test',
            DepartmentID: 34,
            Active: 1,
            CreatedBy: '1',
            CreatedDate: new Date() // Use simple date for debug
        });
        console.log('✅ Success!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed!');
        console.error(err);
        process.exit(1);
    }
}

debugSubDept();
