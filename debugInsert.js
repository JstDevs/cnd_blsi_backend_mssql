const db = require('./config/database');

async function repair() {
    try {
        console.log('🚀 Starting repair with full error logging...');

        const data = {
            Description: 'Administrator',
            Active: true,
            CreatedBy: '1',
            CreatedDate: new Date()
        };

        console.log('Attempting to create UserAccess with:', data);

        const adminAccess = await db.userAccess.create(data).catch(err => {
            console.error('Sequelize Error Details:');
            if (err.parent) console.error('Parent Error:', err.parent);
            if (err.original) console.error('Original Error:', err.original);
            throw err;
        });

        console.log('✅ Created with ID:', adminAccess.ID);

    } catch (err) {
        // Already logged detailed info above
    } finally {
        process.exit();
    }
}

repair();
