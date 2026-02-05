const db = require('./config/database');
const lguController = require('./controllers/lgu');

async function verifyLguUpdateFix() {
    try {
        console.log('--- Verifying LGU Update Fix (Server-side Dates) ---');

        // Find the record we just saw in debug (ID: 5)
        // If it's not 5, we'll try to find any first.
        const records = await db.Lgu.findAll({ limit: 1 });
        if (records.length === 0) {
            console.log('No LGU records found to test update.');
            process.exit(0);
        }
        const targetID = records[0].ID;
        console.log(`Targeting LGU ID: ${targetID}`);

        const mockReq = {
            params: { id: targetID },
            body: {
                ...records[0].toJSON(),
                Name: 'Updated LGU Name ' + Date.now()
            },
            user: { id: 'admin-1' }
        };

        const mockRes = {
            json: (data) => {
                console.log('✅ Success! Response data:', JSON.stringify(data, null, 2));
            },
            status: (code) => {
                console.log('❌ Error! Status code:', code);
                return {
                    json: (err) => {
                        console.log('Error details:', err);
                    }
                };
            }
        };

        await lguController.update(mockReq, mockRes);

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

verifyLguUpdateFix();
