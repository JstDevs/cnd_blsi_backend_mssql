const db = require('../config/database');

async function checkBusinessPermits() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('✅ Connection successful.');

        console.log('Checking for BusinessPermit model...');
        if (!db.BusinessPermit) {
            console.error('❌ BusinessPermit model NOT found in db object.');
            return;
        }
        console.log('✅ BusinessPermit model found.');

        console.log('Creating table if not exists...');
        await db.BusinessPermit.sync();
        console.log('✅ Table synced.');

        console.log('Fetching all business permits...');
        const permits = await db.BusinessPermit.findAll();

        console.log(`\nFound ${permits.length} records in "business_permits" table:`);
        permits.forEach(p => {
            console.log(`- ID: ${p.id} | Applicant: ${p.applicantType} | Date: ${p.dateOfApplication} | Status: ${p.status}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkBusinessPermits();
