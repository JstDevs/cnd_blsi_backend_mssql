const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const exportToExcel = async (data, filename) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Post-Closing');

    worksheet.columns = [
        { header: 'Account Code', key: 'accountCode', width: 20 },
        { header: 'Account Name', key: 'accountName', width: 35 },
        { header: 'Debit', key: 'debit', width: 15 },
        { header: 'Credit', key: 'credit', width: 15 },
        { header: 'Balance', key: 'balance', width: 15 },
    ];

    const rows = data.map(item => {
        const debit = Number(item.Debit || 0);
        const credit = Number(item.Credit || 0);
        return {
            accountCode: item.AccountCode || '',
            accountName: item.AccountName || '',
            debit: debit,
            credit: credit,
            balance: debit - credit,
        };
    });

    worksheet.addRows(rows);

    ['C', 'D', 'E'].forEach(colKey => {
        worksheet.getColumn(colKey).numFmt = '#,##0.00;[Red](#,##0.00)';
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    const exportDir = path.join(__dirname, '../public/exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, filename);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
};

exports.view = async (req, res) => {
    try {
        const {
            fiscalYearID,
            dateFrom,
            dateTo,
            fundID,
            approverID,
        } = req.body;

        // For now, return mock data or basic query since wala pa yung SP
        // Mock data below ___
        const results = [
            { AccountCode: '10101010', AccountName: 'Cash in Local Treasury', Debit: 1500000.00, Credit: 0, Municipality: 'San Dionisio', Province: 'Iloilo' },
            { AccountCode: '10102010', AccountName: 'Cash in Bank - Local Currency', Debit: 5250300.50, Credit: 0 },
            { AccountCode: '20101010', AccountName: 'Accounts Payable', Debit: 0, Credit: 1250300.50 },
            { AccountCode: '30101010', AccountName: 'Government Equity', Debit: 0, Credit: 5500000.00 },
        ];

        return res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.exportExcel = async (req, res) => {
    try {
        const {
            fiscalYearID,
            dateFrom,
            dateTo,
            fundID,
            approverID,
        } = req.body;

        const results = [
            { AccountCode: '10101010', AccountName: 'Cash in Bank - Mock', Debit: 1000000, Credit: 0 },
            { AccountCode: '20101010', AccountName: 'Accounts Payable - Mock', Debit: 0, Credit: 500000 },
            { AccountCode: '30101010', AccountName: 'Government Equity - Mock', Debit: 0, Credit: 500000 },
        ];

        const filename = `Post_Closing_${Date.now()}.xlsx`;
        const filePath = await exportToExcel(results, filename);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filePath, err => {
            if (err) console.error('Download error:', err);
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) {
                console.error('Error deleting temp file:', e);
            }
        });
    } catch (err) {
        console.log('Error exporting to Excel:', err);
        res.status(500).json({ error: err.message });
    }
};
