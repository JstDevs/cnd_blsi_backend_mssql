const db = require('./config/database');

async function repair() {
    try {
        console.log('🚀 Starting robust repair...');

        // 1. Create or Find Administrator Access Level (without forcing ID)
        let adminAccess = await db.userAccess.findOne({ where: { Description: 'Administrator' } });
        if (!adminAccess) {
            adminAccess = await db.userAccess.create({
                Description: 'Administrator',
                Active: true,
                CreatedBy: '1',
                CreatedDate: new Date()
            });
            console.log(`✅ Created Administrator Access Level with ID: ${adminAccess.ID}`);
        } else {
            console.log(`ℹ️ Administrator Access Level already exists with ID: ${adminAccess.ID}`);
        }

        // 2. Link Administrator User to this Access Level
        const user = await db.users.findOne({ where: { UserName: 'Administrator' } });
        if (user) {
            // Update the UserAccessID column
            await db.users.update({ UserAccessID: adminAccess.ID }, { where: { ID: user.ID } });
            console.log(`✅ Updated UserAccessID for user ${user.UserName} to ${adminAccess.ID}.`);

            // Update UserUserAccess join table
            const [link, created] = await db.UserUserAccess.findOrCreate({
                where: { UserID: user.ID, UserAccessID: adminAccess.ID },
                defaults: {
                    UserID: user.ID,
                    UserAccessID: adminAccess.ID
                }
            });
            if (created) {
                console.log('✅ Created link in UserUserAccess.');
            } else {
                console.log('ℹ️ User-Access link already exists in UserUserAccess.');
            }
        } else {
            console.error('❌ Could not find "Administrator" user!');
            // Fallback: check for any user
            const anyUser = await db.users.findOne();
            if (anyUser) {
                console.log(`💡 Found user "${anyUser.UserName}". Repairing this instead.`);
                await db.users.update({ UserAccessID: adminAccess.ID }, { where: { ID: anyUser.ID } });
                await db.UserUserAccess.findOrCreate({ where: { UserID: anyUser.ID, UserAccessID: adminAccess.ID } });
            }
        }

        // 3. Populate ModuleAccess
        const modules = await db.Module.findAll();
        console.log(`Found ${modules.length} modules.`);

        for (const mod of modules) {
            const [access, created] = await db.ModuleAccess.findOrCreate({
                where: { UserAccessID: adminAccess.ID, ModuleID: mod.ID },
                defaults: {
                    UserAccessID: adminAccess.ID,
                    ModuleID: mod.ID,
                    View: true,
                    Add: true,
                    Edit: true,
                    Delete: true,
                    Print: true,
                    Mayor: true
                }
            });
            if (!created) {
                await db.ModuleAccess.update({
                    View: true, Add: true, Edit: true, Delete: true, Print: true, Mayor: true
                }, { where: { ID: access.ID } });
            }
        }
        console.log('✅ Module access rights updated for Administrator.');

    } catch (err) {
        console.error('❌ Repair failed:', err);
    } finally {
        process.exit();
    }
}

repair();
