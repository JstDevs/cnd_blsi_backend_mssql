const db = require('./config/database');

async function repair() {
    try {
        console.log('🚀 Starting raw SQL repair...');

        // 1. Raw Insert for UserAccess
        console.log('Inserting into useraccess...');
        await db.sequelize.query(`
        IF NOT EXISTS (SELECT * FROM useraccess WHERE Description = 'Administrator')
        BEGIN
            INSERT INTO useraccess (Description, Active, CreatedBy, CreatedDate)
            VALUES ('Administrator', 1, '1', GETDATE());
        END
    `);

        // Get the ID
        const [access] = await db.sequelize.query("SELECT ID FROM useraccess WHERE Description = 'Administrator'");
        const adminAccessID = access[0].ID;
        console.log(`✅ UserAccess ID: ${adminAccessID}`);

        // 2. Link User
        const [users] = await db.sequelize.query("SELECT ID, UserName FROM users WHERE UserName = 'Administrator'");
        if (users.length > 0) {
            const adminUserID = users[0].ID;
            await db.sequelize.query(`
            IF NOT EXISTS (SELECT * FROM useruseraccess WHERE UserID = ${adminUserID} AND UserAccessID = ${adminAccessID})
            BEGIN
                INSERT INTO useruseraccess (UserID, UserAccessID, createdAt, updatedAt)
                VALUES (${adminUserID}, ${adminAccessID}, GETDATE(), GETDATE());
            END
        `);
            // Also update Users.UserAccessID
            await db.sequelize.query(`UPDATE users SET UserAccessID = ${adminAccessID} WHERE ID = ${adminUserID}`);
            console.log(`✅ Linked user ${users[0].UserName} to access.`);
        }

        // 3. Grant all ModuleAccess permissions
        console.log('Updating all module permissions...');
        await db.sequelize.query(`
        INSERT INTO moduleaccess (UserAccessID, ModuleID, [View], [Add], Edit, [Delete], [Print], Mayor)
        SELECT ${adminAccessID}, ID, 1, 1, 1, 1, 1, 1
        FROM module
        WHERE ID NOT IN (SELECT ModuleID FROM moduleaccess WHERE UserAccessID = ${adminAccessID})
    `);

        // Also update existing ones to 1
        await db.sequelize.query(`
        UPDATE moduleaccess 
        SET [View] = 1, [Add] = 1, Edit = 1, [Delete] = 1, [Print] = 1, Mayor = 1
        WHERE UserAccessID = ${adminAccessID}
    `);

        console.log('🚀 Repair completed successfully!');

    } catch (err) {
        console.error('❌ Raw SQL Repair failed:', err);
    } finally {
        process.exit();
    }
}

repair();
