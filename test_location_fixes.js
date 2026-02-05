const db = require('./config/database');
const regionController = require('./controllers/region');
const subDeptController = require('./controllers/subDepartment');

async function verifyLocationFixes() {
    try {
        console.log('--- Verifying Region Fix ---');
        const mockRes = {
            json: (data) => console.log('✅ Response JSON:', JSON.stringify(data, null, 2).substring(0, 100) + '...'),
            status: (code) => {
                console.log('--- Status:', code);
                return {
                    json: (data) => console.log('--- Response JSON (via status):', JSON.stringify(data, null, 2).substring(0, 100) + '...')
                };
            }
        };

        // Test Region Create
        await regionController.create({
            body: { Name: 'Test Region ' + Date.now() },
            user: { id: 'admin-1' }
        }, mockRes);

        // Test SubDepartment Create (need a DepartmentID)
        console.log('\n--- Verifying SubDepartment Fix ---');
        const dept = await db.Department.findOne();
        if (dept) {
            await subDeptController.create({
                body: { Code: 'SUB-TEST', Name: 'Test SubDept', DepartmentID: dept.ID },
                user: { id: 'admin-1' }
            }, mockRes);
        } else {
            console.log('No department found to test SubDepartment creation.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

verifyLocationFixes();
