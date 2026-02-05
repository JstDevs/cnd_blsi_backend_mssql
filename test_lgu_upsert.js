const db = require('./config/database');
const lgu = require('./controllers/lgu');

async function testLguUpsert() {
    try {
        console.log('--- Testing LGU Upsert (Raw SQL) ---');

        const query = `
      INSERT INTO [lgu] (
        [Logo], [Code], [Name], [TIN], [RDO], [PhoneNumber], [EmailAddress], [Website], 
        [StreetAddress], [BarangayID], [MunicipalityID], [ProvinceID], [RegionID], [ZIPCode], 
        [CreatedBy], [CreatedDate], [Active]
      ) VALUES (
        NULL, 'LGU-001', 'Test LGU', '123-456-789-00000', '001', '09123456789', 'test@example.com', 'http://test.com', 
        'Main St', 1, 1, 1, 1, '1234', 
        '1', GETDATE(), 1
      )
    `;

        console.log('Executing query...');
        await db.sequelize.query(query).catch(err => {
            console.error('SQL Error:');
            console.error(err.message);
            if (err.original) {
                console.error('Original Error:', err.original.message);
            }
            throw err;
        });

        console.log('✅ Success!');
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

testLguUpsert();
