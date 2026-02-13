const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const exportToExcel = async (data, filename) => {
    const exportsDir = path.join(__dirname, '../public/exports');
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Position');

    const flatData = Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) ? data[0] : data;

    if (flatData.length > 0) {
        worksheet.columns = Object.keys(flatData[0] || {}).map(key => ({ header: key, key }));
        worksheet.addRows(flatData);
        worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
    }

    const filePath = path.join(exportsDir, filename);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
};

exports.view = async (req, res) => {
    try {
        const {
            currentYearID,
            nonCurrentYearID,
            dateFrom,
            dateTo,
            fundID,
            approverID
        } = req.body;

        // Placeholder call to SP_FinancialPosition
        const results = await sequelize.query(
            'CALL SP_FinancialPosition(:currentYearID, :nonCurrentYearID, :dateFrom, :dateTo, :fundID, :approverID)',
            {
                replacements: {
                    currentYearID,
                    nonCurrentYearID,
                    dateFrom,
                    dateTo,
                    fundID,
                    approverID
                },
            }
        );

        return res.json(results);
    } catch (err) {
        console.error('Error fetching financial position:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.exportExcel = async (req, res) => {
    try {
        const {
            currentYearID,
            nonCurrentYearID,
            dateFrom,
            dateTo,
            fundID,
            approverID
        } = req.body;

        const results = await sequelize.query(
            'CALL SP_FinancialPosition(:currentYearID, :nonCurrentYearID, :dateFrom, :dateTo, :fundID, :approverID)',
            {
                replacements: {
                    currentYearID,
                    nonCurrentYearID,
                    dateFrom,
                    dateTo,
                    fundID,
                    approverID
                },
            }
        );

        const filename = `Statement_of_Financial_Position_${Date.now()}.xlsx`;
        const filePath = await exportToExcel(results, filename);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filePath, err => {
            if (err) {
                console.error('Error downloading file:', err);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        });
    } catch (err) {
        console.error('Error exporting financial position to Excel:', err);
        res.status(500).json({ error: err.message });
    }
};
