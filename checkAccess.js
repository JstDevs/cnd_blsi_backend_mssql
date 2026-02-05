const db = require('./config/database');

async function check() {
    try {
        const users = await db.users.findAll();
        console.log('--- Users (Full) ---');
        console.log(JSON.stringify(users, null, 2));

        const userAccess = await db.userAccess.findAll();
        console.log('\n--- UserAccess (Full) ---');
        console.log(JSON.stringify(userAccess, null, 2));

        const uua = await db.UserUserAccess.findAll();
        console.log('\n--- UserUserAccess (Full) ---');
        console.log(JSON.stringify(uua, null, 2));

        const modules = await db.Module.findAll();
        console.log('\n--- Modules ---');
        console.log(JSON.stringify(modules, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
