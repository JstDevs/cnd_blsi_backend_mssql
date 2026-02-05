const db = require('./config/database');

async function seedMissing() {
    try {
        // 1. Seed Category if missing
        const [catExists] = await db.sequelize.query(`SELECT ID FROM [documenttypecategory] WHERE ID = 1`);
        if (catExists.length === 0) {
            console.log('Seeding DocumentTypeCategory ID: 1 (Official)');
            const sql = `
        SET IDENTITY_INSERT [documenttypecategory] ON;
        INSERT INTO [documenttypecategory] (ID, Name, Active, CreatedBy, CreatedDate)
        VALUES (1, 'Official', 1, 'system', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}');
        SET IDENTITY_INSERT [documenttypecategory] OFF;
      `;
            await db.sequelize.query(sql);
            console.log('Success.');
        }

        // 2. Seed DocumentTypes
        const missingDocs = [
            {
                ID: 5,
                Code: 'CCI',
                Name: 'Community Tax',
                DocumentTypeCategoryID: 1,
                Prefix: 'CCI',
                StartNumber: 100,
                CurrentNumber: 100,
                Suffix: '2025',
                Active: 1,
                CreatedBy: 'system',
                CreatedDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            },
            {
                ID: 6,
                Code: 'SI',
                Name: 'Service Invoice',
                DocumentTypeCategoryID: 1,
                Prefix: 'SE-IN',
                StartNumber: 500,
                CurrentNumber: 500,
                Suffix: 'Invoice',
                Active: 1,
                CreatedBy: 'system',
                CreatedDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            },
            {
                ID: 18,
                Code: 'ORB',
                Name: 'Burial Receipt',
                DocumentTypeCategoryID: 1,
                Prefix: 'BU-RE',
                StartNumber: 1,
                CurrentNumber: 1,
                Suffix: 'AL-CEIPT',
                Active: 1,
                CreatedBy: 'system',
                CreatedDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }
        ];

        for (const doc of missingDocs) {
            const [exists] = await db.sequelize.query(`SELECT ID FROM [documenttype] WHERE ID = ${doc.ID}`);
            if (exists.length === 0) {
                console.log(`Seeding DocumentType ID: ${doc.ID} (${doc.Name})`);
                const sql = `
          SET IDENTITY_INSERT [documenttype] ON;
          INSERT INTO [documenttype] (ID, Code, Name, DocumentTypeCategoryID, Prefix, StartNumber, CurrentNumber, Suffix, Active, CreatedBy, CreatedDate)
          VALUES (${doc.ID}, '${doc.Code}', '${doc.Name}', ${doc.DocumentTypeCategoryID}, '${doc.Prefix}', ${doc.StartNumber}, ${doc.CurrentNumber}, '${doc.Suffix}', ${doc.Active}, '${doc.CreatedBy}', '${doc.CreatedDate}');
          SET IDENTITY_INSERT [documenttype] OFF;
        `;
                await db.sequelize.query(sql);
                console.log(`Success.`);
            } else {
                console.log(`DocumentType ID: ${doc.ID} already exists.`);
            }
        }
        console.log('✅ Seeding completed.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedMissing();
