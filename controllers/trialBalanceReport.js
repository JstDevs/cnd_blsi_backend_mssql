const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Trial Balance');

  // Define columns based on TrialBalance.jsx
  worksheet.columns = [
    { header: 'Account Code', key: 'accountCode', width: 20 },
    { header: 'Account Name', key: 'accountName', width: 35 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Debit', key: 'debit', width: 15 },
    { header: 'Credit', key: 'credit', width: 15 },
    { header: 'Balance', key: 'balance', width: 15 },
    { header: 'End Date', key: 'endDate', width: 15 },
    { header: 'Approver', key: 'approverName', width: 25 },
  ];

  // Map data to match keys and handle formatting
  const rows = data.map(item => {
    const debit = Number(item.debit || item.Debit || 0);
    const credit = Number(item.credit || item.Credit || 0);
    return {
      accountCode: item.accountCode || item.AccountCode || '',
      accountName: item.accountName || item.AccountName || '',
      category: item.category || item.Category || '',
      debit: debit,
      credit: credit,
      balance: debit - credit,
      endDate: item.endDate || item.EndDate ? new Date(item.endDate || item.EndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      approverName: item.approverName || item.FullName || '',
    };
  });

  worksheet.addRows(rows);

  // Format numeric columns
  ['D', 'E', 'F'].forEach(colKey => {
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

const mockData = [
  {
    "AccountCode": "1010101",
    "AccountName": "Cash in Bank",
    "Debit": 150000.00,
    "Credit": 50000.00,
    "EndDate": "2025-07-05",
    "Funds": "General Fund",
    "FullName": "Maria C. Santos",
    "Position": "Municipal Treasurer",
    "Municipality": "DUENAS"
  },
  {
    "AccountCode": "1010201",
    "AccountName": "Petty Cash",
    "Debit": 20000.00,
    "Credit": 5000.00,
    "EndDate": "2025-07-05",
    "Funds": "General Fund",
    "FullName": "Maria C. Santos",
    "Position": "Municipal Treasurer",
    "Municipality": "DUENAS"
  },
  {
    "AccountCode": "2010101",
    "AccountName": "Accounts Payable",
    "Debit": 0.00,
    "Credit": 100000.00,
    "EndDate": "2025-07-05",
    "Funds": "All Funds",
    "FullName": "Maria C. Santos",
    "Position": "Municipal Treasurer",
    "Municipality": "DUENAS"
  },
  {
    "AccountCode": "3010101",
    "AccountName": "Government Equity",
    "Debit": 0.00,
    "Credit": 150000.00,
    "EndDate": "2025-07-05",
    "Funds": "All Funds",
    "FullName": "Maria C. Santos",
    "Position": "Municipal Treasurer",
    "Municipality": "DUENAS"
  },
  {
    "AccountCode": "4010101",
    "AccountName": "Income from Grants",
    "Debit": 0.00,
    "Credit": 75000.00,
    "EndDate": "2025-07-05",
    "Funds": "Trust Fund",
    "FullName": "Maria C. Santos",
    "Position": "Municipal Treasurer",
    "Municipality": "DUENAS"
  }
];

exports.view = async (req, res) => {
  try {
    const {
      endDate,
      fundID,
      approverID,
      ledger,
    } = req.body;

    const results = await sequelize.query(
      'CALL SP_TrialBalance(:endDate, :fundID, :approver, :sub)',
      {
        replacements: { endDate, fundID, approver: approverID, sub: ledger },
      }
    );

    return res.json(results);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const {
      endDate,
      fundID,
      approverID,
      ledger,
    } = req.body;

    const results = await sequelize.query(
      'CALL SP_TrialBalance(:endDate, :fundID, :approver, :sub)',
      {
        replacements: { endDate, fundID, approver: approverID, sub: ledger },
      }
    );

    // Robust way to handle both [rows, metadata] and direct rows from DB result
    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    }

    const filename = `Trial_Balance_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(rows, filename);
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