const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Subsidiary Ledger');

  // Define columns based on SubsidiaryLedger.jsx
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Fund', key: 'fund', width: 25 },
    { header: 'Account Name', key: 'account_name', width: 30 },
    { header: 'Account Code', key: 'account_code', width: 20 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Ledger Item', key: 'ledger_item', width: 35 },
    { header: 'Debit', key: 'debit', width: 15 },
    { header: 'Credit', key: 'credit', width: 15 },
    { header: 'Balance', key: 'balance', width: 15 },
    { header: 'Municipality', key: 'municipality', width: 25 },
  ];

  // Map data to match keys and handle formatting
  const rows = data.map(item => ({
    ...item,
    id: item.id || '',
    fund: item.fund || item.Fund || '',
    account_name: item.account_name || item.AccountName || '',
    account_code: item.account_code || item.AccountCode || '',
    date: item.date || item.Date ? new Date(item.date || item.Date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    ledger_item: item.ledger_item || item.LedgerItem || '',
    debit: Number(item.debit || item.Debit || 0),
    credit: Number(item.credit || item.Credit || 0),
    balance: Number(item.balance || item.Balance || 0),
    municipality: item.municipality || item.Municipality || '',
  }));

  worksheet.addRows(rows);

  // Format numeric columns
  ['G', 'H', 'I'].forEach(colKey => {
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
    id: 1,
    fund: 'General Fund',
    account_name: 'Real Property Tax Receivable',
    account_code: '1-01-01-010',
    date: '2024-01-15',
    ledger_item: 'Collection of RPT',
    debit: 50000.00,
    credit: 0.00,
    balance: 50000.00,
    municipality: 'BASCO (Capital)',
  },
  {
    id: 2,
    fund: 'Special Education Fund',
    account_name: 'Accounts Payable - Supplies',
    account_code: '2-01-01-020',
    date: '2024-02-10',
    ledger_item: 'Purchase of Office Supplies',
    debit: 0.00,
    credit: 15000.00,
    balance: 35000.00,
    municipality: 'MAHATAO',
  },
  {
    id: 3,
    fund: 'Trust Fund',
    account_name: 'Donations Receivable',
    account_code: '1-01-01-030',
    date: '2024-03-05',
    ledger_item: 'Receipt of External Donations',
    debit: 25000.00,
    credit: 0.00,
    balance: 60000.00,
    municipality: 'IVANA',
  },
  {
    id: 4,
    fund: 'General Fund',
    account_name: 'Accounts Payable - Services',
    account_code: '2-01-01-040',
    date: '2024-03-20',
    ledger_item: 'Payment to Contractor',
    debit: 0.00,
    credit: 20000.00,
    balance: 40000.00,
    municipality: 'SABTANG',
  },
  {
    id: 5,
    fund: 'General Fund',
    account_name: 'Business Permit Income',
    account_code: '4-01-01-050',
    date: '2024-04-12',
    ledger_item: 'Collection of Business Permit Fees',
    debit: 10000.00,
    credit: 0.00,
    balance: 50000.00,
    municipality: 'UYUGAN',
  },
];



exports.view = async (req, res) => {
  try {
    const {
      ChartofAccountsID,
      CutOffDate,
      FundID,
    } = req.body;

    console.log('Subsidiary Ledger View Request:', req.body);

    const results = await sequelize.query(
      'EXEC SP_SubsidiaryLedger :accountCode, :fundID, :cutoff',
      {
        replacements: {
          accountCode: ChartofAccountsID ?? '%',
          fundID: FundID ?? '%',
          cutoff: CutOffDate ?? new Date().toISOString().slice(0, 10)
        },
      }
    );

    // Handle nested results array from CALL if necessary
    const finalData = (Array.isArray(results) && Array.isArray(results[0])) ? results[0] : results;

    // Transform field names to match frontend expectations
    const transformedData = finalData.map(row => ({
      id: row.ID,
      fund: row.Fund || row['Fund Name'],
      account_name: row['Account Name Display'] || row['Account Name'],
      account_code: row['Account Code Display'] || row['Account Code'],
      date: row['Invoice Date'],
      ledger_item: row['Ledger Item'],
      debit: row.Debit,
      credit: row.Credit,
      balance: row.Balance,
      municipality: row.Municipality
    }));

    return res.json(transformedData);
  } catch (err) {
    console.error('Subsidiary Ledger Error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const {
      ChartofAccountsID,
      CutOffDate,
      FundID,
    } = req.body;

    console.log('Subsidiary Ledger Export Request:', req.body);

    const results = await sequelize.query(
      'EXEC SP_SubsidiaryLedger :accountCode, :fundID, :cutoff',
      {
        replacements: {
          accountCode: ChartofAccountsID ?? '%',
          fundID: FundID ?? '%',
          cutoff: CutOffDate ?? new Date().toISOString().slice(0, 10)
        },
      }
    );

    // Handle nested results array from CALL if necessary
    const finalData = (Array.isArray(results) && Array.isArray(results[0])) ? results[0] : results;

    // Transform field names to match frontend expectations
    const transformedData = finalData.map(row => ({
      id: row.ID,
      fund: row.Fund || row['Fund Name'],
      account_name: row['Account Name Display'] || row['Account Name'],
      account_code: row['Account Code Display'] || row['Account Code'],
      date: row['Invoice Date'],
      ledger_item: row['Ledger Item'],
      debit: row.Debit,
      credit: row.Credit,
      balance: row.Balance,
      municipality: row.Municipality
    }));

    const filename = `Subsidiary_Ledger_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(transformedData, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => {
      if (err) {
        console.error('Download error:', err);
      }
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    });
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    res.status(500).json({
      error: 'Export failed',
      message: err.message
    });
  }
};

// const { sequelize } = require('../config/database');
// const { QueryTypes } = require('sequelize');

// exports.getFunds = async (req, res) => {
//   const result = await sequelize.query(
//     `SELECT Name FROM Funds WHERE Active = 1`, 
//     { type: QueryTypes.SELECT }
//   );
//   res.json([...result.map(r => r.Name), 'All Funds']);
// };

// exports.getAccounts = async (req, res) => {
//   const result = await sequelize.query(
//     `SELECT [Account Code], Name FROM [Chart of Accounts] WHERE Active = 1`, 
//     { type: QueryTypes.SELECT }
//   );
//   res.json([...result.map(r => ({
//     code: r['Account Code'],
//     name: r.Name
//   })), { code: '%', name: 'All Accounts' }]);
// };

// exports.getSubsidiaryLedger = async (req, res) => {
//   const { accountCode, fundName, cutoff } = req.body;

//   try {
//     const fund = await sequelize.query(
//       `SELECT ID FROM Funds WHERE Name = :fundName`,
//       { replacements: { fundName }, type: QueryTypes.SELECT }
//     );
//     const fundID = fund.length ? fund[0].ID : '%';

//     const result = await sequelize.query(
//       `CALL SP_SubsidiaryLedger(:accountCode, :fundID, :cutoff)`,
//       {
//         replacements: {
//           accountCode,
//           fundID,
//           cutoff
//         }
//       }
//     );

//     res.json(result);
//   } catch (err) {
//     console.error('Error running SP_SubsidiaryLedger:', err);
//     res.status(500).json({ error: 'Failed to retrieve ledger data' });
//   }
// };
