const { sequelize } = require('../config/database');
const path = require('path');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Cashbook');
  worksheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  worksheet.addRows(data);
  worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
  const filePath = path.join(__dirname, `../public/exports/${filename}`);
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
      'CALL SP_Cashbook_SanDionisio(:startDate, :endDate, :fundID, :user)',
      {
        replacements: { startDate: StartDate, endDate: EndDate, fundID: FundID, user: req.user.employeeID },
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
      'CALL SP_Cashbook_SanDionisio(:startDate, :endDate, :fundID, :user)',
      {
        replacements: { startDate: StartDate, endDate: EndDate, fundID: FundID, user: req.user.employeeID },
      }
    );


    const filename = `Cashbook_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(results, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => { if (err) fs.unlinkSync(filePath); });
  } catch (err) {
    console.log('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};