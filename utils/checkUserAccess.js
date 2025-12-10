const { ModuleAccess, UserAccess } = require('../config/database');

/**
 * Checks if a user has a specific permission for a given module.
 * @param {number} userID - The user's ID
 * @param {number} moduleID - The module's ID
 * @param {string} field - The permission field to check (e.g., 'View', 'Add', 'Edit', 'Delete', 'Mayor')
 * @returns {Promise<boolean>} - True if access is granted, false otherwise
 */
async function hasAccess(userID, moduleID, field) {
    try {
        const access = await ModuleAccess.findOne({
            include: [{
                model: UserAccess,
                required: true,
                where: { Active: true }
            }],
            where: {
                UserID: userID,
                ModuleID: moduleID,
                [field]: true
            }
        });

        return !!access;
    } catch (error) {
        console.error('Error checking access:', error);
        return false;
    }
}

module.exports = {
  hasAccess
};
