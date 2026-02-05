const db = require('./config/database');

async function checkDocTypes() {
    try {
        const docTypes = await db.documentType.findAll({
            where: {
                ID: [5, 6, 18]
            }
        });
        console.log(JSON.stringify(docTypes, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDocTypes();
