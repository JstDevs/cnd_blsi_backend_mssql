const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('General Ledger');

  // Define columns based on GeneralLedgerPage.jsx columns
  worksheet.columns = [
    { header: 'Invoice Number', key: 'invoice_number', width: 20 },
    { header: 'Fund', key: 'fund', width: 25 },
    { header: 'Account Name', key: 'account_name', width: 30 },
    { header: 'Account Code', key: 'account_code', width: 20 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Debit', key: 'debit', width: 15 },
    { header: 'Credit', key: 'credit', width: 15 },
    { header: 'Balance', key: 'balance', width: 15 },
  ];

  // Map data to match keys and handle formatting
  const rows = data.map(item => ({
    ...item,
    invoice_number: item.invoice_number || item['Invoice Number'] || '',
    fund: item.fund || item['Fund Name'] || '',
    account_name: item.account_name || item['Account Name'] || '',
    account_code: item.account_code || item['Account Code'] || '',
    date: item.date || item['Invoice Date'] ? new Date(item.date || item['Invoice Date']).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    debit: Number(item.debit || item.Debit || 0),
    credit: Number(item.credit || item.Credit || 0),
    balance: Number(item.balance || item.Balance || 0),
  }));

  worksheet.addRows(rows);

  // Format numeric columns as currency-ish
  ['F', 'G', 'H'].forEach(colKey => {
    worksheet.getColumn(colKey).numFmt = '#,##0.00;[Red](#,##0.00)';
  });

  // Header styling
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  const exportDir = path.join(__dirname, '../public/exports');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filePath = path.join(exportDir, filename);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};
const mockData = [
  {
    id: 1,
    fund: 'General Fund',
    account_name: 'Cash in Bank - Local Currency',
    account_code: '1-01-02-100',
    date: '2024-01-15',
    ledger_item: 'Opening Balance',
    invoice_number: 'OB-2024',
    debit: 1000000.00,
    credit: 0.00,
    balance: 1000000.00,
    Municipality: 'San Dionisio',
  },
  {
    id: 2,
    fund: 'General Fund',
    account_name: 'Cash in Bank - Local Currency',
    account_code: '1-01-02-100',
    date: '2024-01-20',
    ledger_item: 'Collection of Taxes',
    invoice_number: 'OR-2024-001',
    debit: 50000.00,
    credit: 0.00,
    balance: 1050000.00,
    Municipality: 'San Dionisio',
  },
  {
    id: 3,
    fund: 'General Fund',
    account_name: 'Cash in Bank - Local Currency',
    account_code: '1-01-02-100',
    date: '2024-01-25',
    ledger_item: 'Payment of Salaries',
    invoice_number: 'DV-2024-001',
    debit: 0.00,
    credit: 200000.00,
    balance: 850000.00,
    Municipality: 'San Dionisio',
  }
];


exports.view = async (req, res) => {
  try {
    const {
      ChartofAccountsID,
      CutOffDate,
      FundID,
    } = req.body;

    console.log('General Ledger View Request Body:', req.body);

    const results = await sequelize.query(
      'EXEC SP_GeneralLedger :accountCode, :fundID, :cutoff',
      // 'EXEC SP_GeneralLedger :accountCode, :fundID, :cutoff, :linkID',
      {
        replacements: {
          accountCode: ChartofAccountsID ?? '%',
          fundID: FundID ?? '%',
          cutoff: CutOffDate ?? new Date().toISOString().slice(0, 10)
          // linkID: req.body.LinkID ?? '%'
        },
      }
    );
    console.log('SP_GeneralLedger Raw Results Structure:', {
      type: typeof results,
      isArray: Array.isArray(results),
      keys: results ? Object.keys(results) : [],
      firstKeyType: results && Object.keys(results).length > 0 ? typeof results[Object.keys(results)[0]] : 'n/a'
    });

    // Most robust way to handle both [rows, metadata] and direct rows
    let finalData = [];
    if (Array.isArray(results)) {
      // If it's an array, it might be the rows directly or [rows, metadata]
      if (results.length > 0 && Array.isArray(results[0])) {
        finalData = results[0]; // [rows, metadata] case
      } else {
        finalData = results; // direct rows case
      }
    }

    console.log('Final Data Rows:', finalData.length);
    return res.json(finalData);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const {
      ChartofAccountsID,
      CutOffDate,
      FundID,
    } = req.body;

    const results = await sequelize.query(
      'EXEC SP_GeneralLedger :accountCode, :fundID, :cutoff',
      {
        replacements: { accountCode: ChartofAccountsID ?? '%', fundID: FundID ?? '%', cutoff: CutOffDate ?? new Date().toISOString().slice(0, 10) },
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

    if (rows.length === 0) {
      console.log('No data found for export');
    }

    const filename = `General_Ledger_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(rows, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => {
      if (err) {
        console.error('Download error:', err);
      }
      // Attempt to delete the file after download
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

// const { GeneralLedger } = require('../config/database');
// const { sequelize } = require('../config/database');
// const { QueryTypes } = require('sequelize');
// exports.create = async (req, res) => {
//   try {
//     const { LinkID, FundID, FundName, LedgerItem, AccountName, AccountCode, Debit, Credit, CreatedBy, CreatedDate, DocumentTypeName, PostingPeriod } = req.body;
//     const item = await GeneralLedger.create({ LinkID, FundID, FundName, LedgerItem, AccountName, AccountCode, Debit, Credit, CreatedBy, CreatedDate, DocumentTypeName, PostingPeriod });
//     res.status(201).json(item);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAll = async (req, res) => {
//   try {
//     const items = await GeneralLedger.findAll();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getById = async (req, res) => {
//   try {
//     const item = await GeneralLedger.findByPk(req.params.id);
//     if (item) res.json(item);
//     else res.status(404).json({ message: "GeneralLedger not found" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const { LinkID, FundID, FundName, LedgerItem, AccountName, AccountCode, Debit, Credit, CreatedBy, CreatedDate, DocumentTypeName, PostingPeriod } = req.body;
//     const [updated] = await GeneralLedger.update({ LinkID, FundID, FundName, LedgerItem, AccountName, AccountCode, Debit, Credit, CreatedBy, CreatedDate, DocumentTypeName, PostingPeriod }, {
//       where: { id: req.params.id }
//     });
//     if (updated) {
//       const updatedItem = await GeneralLedger.findByPk(req.params.id);
//       res.json(updatedItem);
//     } else {
//       res.status(404).json({ message: "GeneralLedger not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.delete = async (req, res) => {
//   try {
//     const deleted = await GeneralLedger.destroy({ where: { id: req.params.id } });
//     if (deleted) res.json({ message: "GeneralLedger deleted" });
//     else res.status(404).json({ message: "GeneralLedger not found" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// exports.getGeneralLedgerData = async (req, res) => {
//   const { accountCode, fundName, startDate,endDate } = req.params;

//   const fund = await sequelize.query(
//     "SELECT ID FROM Funds WHERE Name = :fundName",
//     { replacements: { fundName }, type: QueryTypes.SELECT }
//   );

//   const fundID = fund[0]?.ID || '%';

//  const results = await sequelize.query(`
//       SELECT
//         tbl.ID,
//         tbl.APAR,
//         tbl.Fund,
//         tbl.AccountName,
//         tbl.AccountCode,
//         tbl.Date,
//         tbl.LedgerItem,
//         tbl.InvoiceNumber,
//         tbl.AccountCodeDisplay,
//         tbl.AccountNameDisplay,
//         tbl.Debit,
//         tbl.Credit,
//         CASE
//           WHEN SUM(tbl.Debit) OVER (ORDER BY tbl.InvoiceNumber) = 0.00
//             THEN NULL
//           ELSE SUM(tbl.Debit) OVER (ORDER BY tbl.InvoiceNumber)
//         END AS RunningTotal
//       FROM tbl
//       WHERE tbl.AccountCode LIKE :accountCode
//         AND tbl.FundID LIKE :fundID
//         AND tbl.Date BETWEEN :startDate AND :endDate
//     `, {
//        replacements: { accountCode, fundID, startDate, endDate },
//       type: QueryTypes.SELECT
//     });

//   res.json(result);
// };