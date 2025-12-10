const { ApprovalMatrix, documentType } = require('../config/database');
const { Op, fn, col, literal } = require('sequelize');

/**
 * Get the latest ApprovalMatrix version and active row count
 * for a specific document type (formatted as "Code - Name").
 *
 * @param {string} documentTypeText - e.g. "ARO - Allotment Release Order"
 * @returns {Promise<{ rowCount: number, latestVersion: number | null }>}
 */
async function getLatestApprovalMatrixInfo(documentTypeText) {
  try {
    // Step 1: Find the latest version for this document type
    const subquery = await ApprovalMatrix.findOne({
      include: [{
        model: documentType,
        as: 'DocumentType',
        where: literal(`CONCAT(DocumentType.Code, ' - ', DocumentType.Name) = ${JSON.stringify(documentTypeText)}`),
      }],
      where: { Active: 1 },
      attributes: [[fn('MAX', col('Version')), 'LatestVersion']],
      raw: true,
    });

    const latestVersion = subquery?.LatestVersion;

    if (!latestVersion) {
      return { rowCount: 0, latestVersion: null };
    }

    // Step 2: Count how many active rows exist for this version and document type
    const rowCount = await ApprovalMatrix.count({
      include: [{
        model: documentType,
        as: 'DocumentType',
        where: literal(`CONCAT(DocumentType.Code, ' - ', DocumentType.Name) = ${JSON.stringify(documentTypeText)}`),
      }],
      where: {
        Active: 1,
        Version: latestVersion,
      },
    });

    return { rowCount, latestVersion };

  } catch (error) {
    console.error('❌ Error in getLatestApprovalMatrixInfo:', error.message);
    throw new Error('Failed to retrieve approval matrix info.');
  }
}

module.exports = getLatestApprovalMatrixInfo;
