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

        try {
            // Attempt to call SP_FinancialPosition
            const results = await sequelize.query(
                'EXEC SP_FinancialPosition @currentYearID=:currentYearID, @nonCurrentYearID=:nonCurrentYearID, @dateFrom=:dateFrom, @dateTo=:dateTo, @fundID=:fundID, @approverID=:approverID',
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
            return res.json(results[0] || []);
        } catch (spError) {
            console.warn('SP_FinancialPosition failed or missing, returning mock data:', spError.message);
            // Return mock data for now since wala pa yung SP
            const mockResults = [
                { AccountCode: '10101010', AccountName: 'Cash and Cash Equivalents', CurrentYearBalance: 1250000.50, NonCurrentYearBalance: 1100000.00 },
                { AccountCode: '10201010', AccountName: 'Investments', CurrentYearBalance: 500000.00, NonCurrentYearBalance: 500000.00 },
                { AccountCode: '10301010', AccountName: 'Receivables', CurrentYearBalance: 250000.00, NonCurrentYearBalance: 300000.00 },
                { AccountCode: '20101010', AccountName: 'Accounts Payable', CurrentYearBalance: 450000.00, NonCurrentYearBalance: 400000.00 },
                { AccountCode: '20201010', AccountName: 'Other Liabilities', CurrentYearBalance: 150000.00, NonCurrentYearBalance: 200000.00 },
                { AccountCode: '30101010', AccountName: 'Government Equity', CurrentYearBalance: 1400000.50, NonCurrentYearBalance: 1300000.00 },
            ];
            return res.json(mockResults);
        }
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

        let results;
        try {
            results = await sequelize.query(
                'EXEC SP_FinancialPosition @currentYearID=:currentYearID, @nonCurrentYearID=:nonCurrentYearID, @dateFrom=:dateFrom, @dateTo=:dateTo, @fundID=:fundID, @approverID=:approverID',
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
            results = results[0] || [];
        } catch (spError) {
            console.warn('SP_FinancialPosition failed or missing during export, using mock data');
            results = [
                { AccountCode: '10101010', AccountName: 'Cash and Cash Equivalents', CurrentYearBalance: 1250000.50, NonCurrentYearBalance: 1100000.00 },
                { AccountCode: '10201010', AccountName: 'Investments', CurrentYearBalance: 500000.00, NonCurrentYearBalance: 500000.00 },
                { AccountCode: '10301010', AccountName: 'Receivables', CurrentYearBalance: 250000.00, NonCurrentYearBalance: 300000.00 },
            ];
        }

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
