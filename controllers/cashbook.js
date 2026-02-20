const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Cashbook');

  // Define columns based on CashbookPage.jsx
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Reference', key: 'reference', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Debit', key: 'debit', width: 15 },
    { header: 'Credit', key: 'credit', width: 15 },
    { header: 'Balance', key: 'balance', width: 15 },
  ];

  // Map data to match keys and handle formatting
  const rows = data.map(item => ({
    ...item,
    date: item.date || item.InvoiceDate ? new Date(item.date || item.InvoiceDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    reference: item.reference || item.InvoiceNumber || '',
    description: item.description || item.APAR || '',
    debit: Number(item.debit || item.Debit || 0),
    credit: Number(item.credit || item.Credit || 0),
    balance: Number(item.balance || item.Balance || 0),
  }));

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
    "Year": 2025,
    "Officer": "Maria Santos",
    "Fund": "General Fund",
    "InvoiceDate": "2025-07-10",
    "APAR": "Marriage Receipt",
    "InvoiceNumber": "MR-2025-0001",
    "Debit": 500.00,
    "Credit": 0.00,
    "Balance": 500.00
  },
  {
    "Year": 2025,
    "Officer": "Juan Dela Cruz",
    "Fund": "Special Fund",
    "InvoiceDate": "2025-07-09",
    "APAR": "Burial Receipt",
    "InvoiceNumber": "BR-2025-0021",
    "Debit": 0.00,
    "Credit": 1000.00,
    "Balance": -1000.00
  },
  {
    "Year": 2025,
    "Officer": "Ana Reyes",
    "Fund": "General Fund",
    "InvoiceDate": "2025-07-08",
    "APAR": "Collection",
    "InvoiceNumber": "CR-2025-0100",
    "Debit": 250.00,
    "Credit": 250.00,
    "Balance": 0.00
  },
  {
    "Year": 2025,
    "Officer": "Pedro Villanueva",
    "Fund": "Trust Fund",
    "InvoiceDate": "2025-07-07",
    "APAR": "Cash Receipt",
    "InvoiceNumber": "CR-2025-0087",
    "Debit": 750.00,
    "Credit": 0.00,
    "Balance": 750.00
  }
];



exports.view = async (req, res) => {
  try {
    const {
      StartDate,
      EndDate,
      FundID,
    } = req.body;

    const results = await sequelize.query(
      'EXEC SP_Cashbook @startDate = :startDate, @endDate = :endDate, @fundID = :fundID',
      {
         replacements: { startDate: StartDate, endDate: EndDate, fundID: FundID },
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
      StartDate,
      EndDate,
      FundID,
    } = req.body;

    const results = await sequelize.query(
      'EXEC SP_Cashbook_SanDionisio @startDate = :startDate, @endDate = :endDate, @fundID = :fundID',
      {
        replacements: { startDate: StartDate, endDate: EndDate, fundID: FundID },
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

    const filename = `Cashbook_${Date.now()}.xlsx`;
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