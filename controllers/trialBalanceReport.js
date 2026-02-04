const { sequelize } = require('../config/database');
const path = require('path');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Trial Balance');
  worksheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  worksheet.addRows(data);
  worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
  const filePath = path.join(__dirname, `../public/exports/${filename}`);
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

    const filename = `Trial_Balance_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(results, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => { if (err) fs.unlinkSync(filePath); });
  } catch (err) {
    console.log('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};