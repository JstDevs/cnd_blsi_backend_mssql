const { sequelize } = require('../config/database');
const path = require('path');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Consolidate Comparison');
  worksheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  worksheet.addRows(data);
  worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
  const filePath = path.join(__dirname, `../public/exports/${filename}`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

const mockData = [
  {
    Type: 'Revenue',
    Term: 'FY 2024',
    SubType: 'Tax Revenue',
    Notes: 'Includes property and business taxes',
    Values: 1200000,
    Comparison: 100000, // 1,200,000 - 1,100,000 last year
  },
  {
    Type: 'Expenditure',
    Term: 'Q1 2024',
    SubType: 'Operating Expenses',
    Notes: 'Covers salaries, utilities, and admin costs',
    Values: 850000,
    Comparison: -45000, // 850,000 - 895,000 last year
  },
  {
    Type: 'Revenue',
    Term: 'FY 2024',
    SubType: 'Grants',
    Notes: 'National government grant for infrastructure',
    Values: 2000000,
    Comparison: 0, // No change from last year
  },
  {
    Type: 'Expenditure',
    Term: 'Q2 2024',
    SubType: 'Capital Outlay',
    Notes: 'New municipal building construction',
    Values: 1500000,
    Comparison: 250000, // Increase from 1,250,000 last year
  },
  {
    Type: 'Revenue',
    Term: 'Q3 2024',
    SubType: 'Service Income',
    Notes: 'Income from permits and licenses',
    Values: 500000,
    Comparison: 37000, // Increased from 463,000 last year
  },
];


exports.view = async (req, res) => {
  try {
    const {
      year
    } = req.body;

    const results = await sequelize.query(
      'CALL SP_ComparisonFSP(:Date, :Notes)',
      {
        replacements: { Date: year, Notes: '' },
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
      year,
    } = req.body;
    
    const results = await sequelize.query(
      'CALL SP_ComparisonFSP(:Date, :Notes)',
      {
        replacements: { Date: year, Notes: '' },
      }
    );

    const filename = `Consolidated_Statement_of_Financial_Position_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(results, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => { if (err) fs.unlinkSync(filePath); });
  } catch (err) {
    console.log('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};