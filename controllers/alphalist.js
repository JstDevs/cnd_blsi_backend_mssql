const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const exportToExcel = async (data, filename, reportType) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Alphalist');

    // Define columns based on SP output keys
    worksheet.columns = [
        { header: 'TIN', key: 'TIN', width: 20 },
        { header: 'Payee Name', key: 'Payee', width: 35 },
        { header: 'ATC', key: 'Tax Code', width: 10 },
        { header: 'Nature of Payment', key: 'Nature', width: 20 },
        { header: 'Tax Base', key: 'Sub-Total', width: 15 },
        { header: 'Tax Rate', key: 'Tax Rate', width: 10 },
        { header: 'Tax Withheld', key: 'Withheld Amount', width: 15 },
    ];

    worksheet.addRows(data);

    // Format numeric columns
    ['E', 'G'].forEach(colKey => {
        worksheet.getColumn(colKey).numFmt = '#,##0.00;[Red](#,##0.00)';
    });

    // Header styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    const exportDir = path.join(__dirname, '../public/exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, filename);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
};

exports.fetchAlphalist = async (req, res) => {
    const { year, fundID, departmentID, quarter, month, reportType } = req.body;

    const fund = fundID || '%';
    const department = departmentID || '%';

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
    const { year, fundID, departmentID, quarter, month, reportType } = req.body;

    const fund = fundID || '%';
    const department = departmentID || '%';

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
            query = 'EXEC SP_AlphalistYearly :year, :fund, :department';
            replacements = { year, fund, department };
        }

        const results = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });

        const filename = `Alphalist_${reportType}_${year}_${Date.now()}.xlsx`;
        const filePath = await exportToExcel(results, filename, reportType);

        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filePath, err => {
            if (err) console.error('Download error:', err);
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) {
                console.error('Error deleting temp file:', e);
            }
        });
    } catch (error) {
        console.error(`Error exporting Alphalist (${reportType}):`, error);
        res.status(500).json({ error: `Failed to export ${reportType} Alphalist data`, detail: error.message });
    }
};
