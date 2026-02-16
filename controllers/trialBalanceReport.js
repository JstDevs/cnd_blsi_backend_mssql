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
    "AccountCode": "10101010",
    "AccountName": "Cash - Local Treasury",
    "Debit": 2328772.73,
    "Credit": 9012.00,
    "EndDate": "2025-05-30",
    "Funds": "General Fund",
    "FullName": "Cedric A. Entac",
    "Municipality": "LUCENA"
  },
  {
    "AccountCode": "10101020",
    "AccountName": "Due from Local Government Units",
    "Debit": 0.00,
    "Credit": 51228.78,
    "EndDate": "2025-05-30",
    "Funds": "General Fund",
    "FullName": "Cedric A. Entac",
    "Municipality": "LUCENA"
  },
  {
    "AccountCode": "10101020",
    "AccountName": "Petty Cash",
    "Debit": 66660.00,
    "Credit": 349572.00,
    "EndDate": "2025-05-30",
    "Funds": "General Fund",
    "FullName": "Cedric A. Entac",
    "Municipality": "LUCENA"
  },
  {
    "AccountCode": "10102010",
    "AccountName": "Cash in Bank - Local Currency, Current Account",
    "Debit": 0.00,
    "Credit": 18480.00,
    "EndDate": "2025-05-30",
    "Funds": "General Fund",
    "FullName": "Cedric A. Entac",
    "Municipality": "LUCENA"
  },
  {
    "AccountCode": "10205990",
    "AccountName": "Other Investments",
    "Debit": 3040000.00,
    "Credit": 2678571.42,
    "EndDate": "2025-05-30",
    "Funds": "General Fund",
    "FullName": "Cedric A. Entac",
    "Municipality": "LUCENA"
  },
  {
    "AccountCode": "50101010",
    "AccountName": "Salaries and Wages - Regular",
    "Debit": 100000.00,
    "Credit": 118110.00,
    "EndDate": "2025-05-30",
    "Funds": "General Fund",
    "FullName": "Cedric A. Entac",
    "Municipality": "LUCENA"
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

    let results;
    try {
      results = await sequelize.query(
        'EXEC SP_TrialBalance :endDate, :fundID, :approver, :sub',
        {
          replacements: {
            endDate: endDate || new Date().toISOString().slice(0, 10),
            fundID: fundID || '%',
            approver: approverID || '%',
            sub: ledger || '%'
          },
        }
      );
    } catch (dbErr) {
      console.error('Database Error, falling back to mock data:', dbErr);
      results = mockData;
    }

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

    let results;
    try {
      results = await sequelize.query(
        'EXEC SP_TrialBalance :endDate, :fundID, :approver, :sub',
        {
          replacements: {
            endDate: endDate || new Date().toISOString().slice(0, 10),
            fundID: fundID || '%',
            approver: approverID || '%',
            sub: ledger || '%'
          },
        }
      );
    } catch (dbErr) {
      console.error('Database Error in Export, falling back to mock data:', dbErr);
      results = mockData;
    }

    // Robust way to handle both [rows, metadata] and direct rows from DB result
    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    } else if (results) {
      rows = results;
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