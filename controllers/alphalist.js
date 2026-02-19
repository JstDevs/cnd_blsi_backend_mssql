const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

exports.fetchAlphalist = async (req, res) => {
    const { year, fundID, departmentID, quarter, month, reportType } = req.body;

    const fund = fundID;
    const department = departmentID;

    try {
        let query = '';
        let replacements = {};

        if (reportType === 'Monthly') {
            query = 'EXEC SP_AlphalistMonthly :year, :month, :fund, :department';
            replacements = { year, month, fund, department };
        } else if (reportType === 'Quarterly') {
            query = 'EXEC SP_AlphalistQuarterly :year, :quarter, :fund, :department';
            replacements = { year, quarter, fund, department };
        } else {
            // Default to Yearly
            query = 'EXEC SP_AlphalistYearly :year, :fund, :department';
            replacements = { year, fund, department };
        }

        const results = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });

        res.json(results);
    } catch (error) {
        console.error(`Error fetching Alphalist (${reportType}):`, error);
        res.status(500).json({ error: `Failed to fetch ${reportType} Alphalist data`, detail: error.message });
    }
};

exports.exportExcel = async (req, res) => {
    // Excel export implementation will follow
    res.status(200).send('Excel export logic to be implemented.');
};
