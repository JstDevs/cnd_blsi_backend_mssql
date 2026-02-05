const db = require('./config/database');
const lgu = require('./controllers/lgu');

async function verifyLguFix() {
    try {
        console.log('--- Verifying LGU Fix (Empty Table) ---');
        const mockRes = {
            json: (data) => {
                console.log('Response Data:', JSON.stringify(data, null, 2));
            },
            status: (code) => {
                console.log('Status Code:', code);
                return { json: (err) => console.log('Error Response:', err) };
            }
        };

        // Test getAll
        await lgu.getAll({}, mockRes);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyLguFix();
