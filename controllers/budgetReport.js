const { sequelize } = require('../config/database');
const path = require('path');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Budget Report');
  worksheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  worksheet.addRows(data);
  worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
  const filePath = path.join(__dirname, `../public/exports/${filename}`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

const mockData = [
  {
    "Name": "Office Supplies",
    "Account Code": "50201010",
    "Appropriated": 100000,
    "Adjustments": 5000,
    "Allotments": 95000,
    "Obligations": 70000,
    "Appropriation Balance": 35000,
    "Allotment Balance": 25000
  },
  {
    "Name": "Utility Expenses",
    "Account Code": "50202010",
    "Appropriated": 80000,
    "Adjustments": -5000,
    "Allotments": 75000,
    "Obligations": 60000,
    "Appropriation Balance": 15000,
    "Allotment Balance": 15000
  },
  {
    "Name": "Travel Expenses",
    "Account Code": "50203010",
    "Appropriated": 60000,
    "Adjustments": 10000,
    "Allotments": 65000,
    "Obligations": 30000,
    "Appropriation Balance": 40000,
    "Allotment Balance": 35000
  },
  {
    "Name": "Training and Development",
    "Account Code": "50204010",
    "Appropriated": 120000,
    "Adjustments": 0,
    "Allotments": 120000,
    "Obligations": 90000,
    "Appropriation Balance": 30000,
    "Allotment Balance": 30000
  }
];




exports.view = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      fiscalYearID,
      fundsID,
      departmentID,
    } = req.body;

    const results = await sequelize.query(
      'CALL display_BudgetReport(:startDate, :endDate, :depID, :fiscalYear, :fundID)',
      {
        replacements: { startDate, endDate, depID: departmentID, fiscalYear: fiscalYearID, fundID: fundsID },
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
      startDate,
      endDate,
      fiscalYearID,
      fundsID,
      departmentID,
    } = req.body;
    
    const results = await sequelize.query(
      'CALL display_BudgetReport(:startDate, :endDate, :depID, :fiscalYear, :fundID)',
      {
        replacements: { startDate, endDate, depID: departmentID, fiscalYear: fiscalYearID, fundID: fundsID },
      }
    );

    const filename = `Budget_Report_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(results, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => { if (err) fs.unlinkSync(filePath); });
  } catch (err) {
    console.log('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};