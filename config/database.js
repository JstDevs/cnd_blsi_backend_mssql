const { Sequelize } = require('sequelize');
var initModels = require("../models/init-models");

const seedServiceInvoiceAccounts = require('../seeders/seedServiceInvoiceAccounts');
const seedLgu = require('../seeders/seedLgu');
const seedUserAccess = require('../seeders/seedUserAccess');
const seedDocumentType = require('../seeders/seedDocumentType');
const seedDocumentTypeCategory = require('../seeders/seedDocumentTypeCategory');
const seedDepartments = require('../seeders/seedDepartments');

// let sequelize;

// const sequelize = new Sequelize('bls1', 'sa', 'password@9873', {
//   host: 'localhost',
//   dialect: 'mssql',
//   dialectOptions: {
//     // instanceName: 'SQLEXPRESS', // 🟢 THIS IS REQUIRED
//     options: {
//       trustServerCertificate: true
//     }
//   },
//   logging: false
// });


// const sequelize = new Sequelize('blsa', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   dialectOptions: {
//     // instanceName: 'SQLEXPRESS', // 🟢 THIS IS REQUIRED
//     // options: {
//     //   trustServerCertificate: true
//     // }
//   },
//   logging: false
// });

// Ensure dotenv is loaded if not already loaded
if (!process.env.DB_NAME) {
  require('dotenv').config();
}

// Debug: Log environment variables
console.log("🔍 Database Configuration:");
console.log("  DB_HOST:", process.env.DB_HOST);
console.log("  DB_PORT:", process.env.DB_PORT);
console.log("  DB_USER:", process.env.DB_USER);
console.log("  DB_NAME:", process.env.DB_NAME);
console.log("  DB_PASSWORD:", process.env.DB_PASSWORD ? "***" : "NOT SET");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  define: {
    freezeTableName: true  // ⬅️ All models won't be pluralized
  },
  // dialect: 'mssql', // Use 'mssql' for Microsoft SQL Server
  // dialect: 'mysql', // Use 'mysql' for MySQL
  port: parseInt(process.env.DB_PORT, 10) || 3306, // Parse port as integer
   pool: {
    max: 50,
    min: 0,
    acquire: 30000, // ⬅️ 30 sec wait for connection
    idle: 10000     // ⬅️ 10 sec before releasing idle
  },
 
  dialectOptions: {
    connectTimeout: 60000, // ⬅️ 60 sec MySQL connection timeout
    // MySQL-specific options (not SQL Server options)
  },
  logging: false
});

sequelize.authenticate()
  .then(async() => {
    // await db.UserAccess.initialize();
    console.log('✅ Connection has been established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('\n🔧 Troubleshooting ECONNREFUSED:');
      console.error('   Attempting to connect to:', process.env.DB_HOST || 'localhost');
      console.error('   Port:', process.env.DB_PORT || 3306);
      if (process.env.DB_HOST === 'localhost' || !process.env.DB_HOST) {
        console.error('   1. Make sure MySQL server is running locally');
        console.error('   2. Check if MySQL is listening on port', process.env.DB_PORT || 3306);
        console.error('   3. Verify MySQL service is started (Windows: Services.msc)');
      } else {
        console.error('   1. Verify the remote host is correct:', process.env.DB_HOST);
        console.error('   2. Check if the remote MySQL server is running and accessible');
        console.error('   3. Verify firewall allows connections on port', process.env.DB_PORT || 3306);
        console.error('   4. Check if your IP is whitelisted on the remote MySQL server');
        console.error('   5. Test connection: mysql -u', process.env.DB_USER, '-p -h', process.env.DB_HOST, '-P', process.env.DB_PORT || 3306);
      }
      console.error('');
    }
  });


const db = initModels(sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Optional: sync models to DB

sequelize.sync({
  // force: true, // Set to true to drop and recreate tables
  // alter: true // Set to true to update existing tables
}).then(async () => {
  console.log('✅ All models were synchronized successfully.');
  
  // await seedServiceInvoiceAccounts(db);
  // await seedLgu(db);
  // await seedUserAccess(db);
  // await seedDocumentType(db);
  // await seedDocumentTypeCategory(db);
  // await seedDepartments(db);
  // create new seed for funds also

}).catch(err => {
  console.error('❌ Error synchronizing models:', err.message || err);
  if (err.code === 'ECONNREFUSED') {
    if (process.env.DB_HOST === 'localhost' || !process.env.DB_HOST) {
      console.error('   This error is likely due to MySQL server not running locally.');
      console.error('   Please start MySQL service and try again.\n');
    } else {
      console.error('   Cannot connect to remote MySQL server at:', process.env.DB_HOST);
      console.error('   Please verify the host address and network connectivity.\n');
    }
  }
});

module.exports = db;
