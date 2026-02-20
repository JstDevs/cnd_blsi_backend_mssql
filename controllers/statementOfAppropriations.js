const { sequelize } = require('../config/database');
const path = require('path');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Statement of Appropriations');
  worksheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  worksheet.addRows(data);
  worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
  const filePath = path.join(__dirname, `../public/exports/${filename}`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

const mockDataView = [
  {
    "Fund": "General Fund",
    "Year": 2025,
    "Month End": "June",
    "Account Code": "701-01",
    "ID": 1,
    "Category": "Personnel Services",
    "Name": "Salaries and Wages - Regular",
    "Appropriation": 1000000,
    "Allotment": 900000,
    "Obligation": 850000,
    "Unobligated Appropriation": 150000,
    "Unobligated Allotment": 50000,
    "Municipality": "Ilagan",
    "Province": "Isabela",
    "Requested By": "Juan Dela Cruz",
    "Position": "Budget Officer"
  },
  {
    "Fund": "SEF",
    "Year": 2025,
    "Month End": "June",
    "Account Code": "705-02",
    "ID": 2,
    "Category": "MOOE",
    "Name": "Electricity and Water Expenses",
    "Appropriation": 300000,
    "Allotment": 250000,
    "Obligation": 240000,
    "Unobligated Appropriation": 60000,
    "Unobligated Allotment": 10000,
    "Municipality": "Santiago",
    "Province": "Isabela",
    "Requested By": "Maria Santos",
    "Position": "Accountant"
  },
  {
    "Fund": "Trust Fund",
    "Year": 2025,
    "Month End": "June",
    "Account Code": "902-10",
    "ID": 3,
    "Category": "Capital Outlay",
    "Name": "Infrastructure Projects",
    "Appropriation": 500000,
    "Allotment": 400000,
    "Obligation": 300000,
    "Unobligated Appropriation": 200000,
    "Unobligated Allotment": 100000,
    "Municipality": "Roxas",
    "Province": "Isabela",
    "Requested By": "Carlos Rivera",
    "Position": "Engineer III"
  }
];

const mockDataViewSAO = [
  {
    "Date": "2025-07-01",
    "OBR No.": "OBR-001",
    "Particulars": "Purchase of office supplies",
    "Appropriation/ Allotment": 50000,
    "Expenses": 20000,
    "Balance": 30000
  },
  {
    "Date": "2025-07-05",
    "OBR No.": "OBR-002",
    "Particulars": "Payment for utility bills",
    "Appropriation/ Allotment": 30000,
    "Expenses": 25000,
    "Balance": 5000
  },
  {
    "Date": "2025-07-08",
    "OBR No.": "OBR-003",
    "Particulars": "Repair and maintenance",
    "Appropriation/ Allotment": 40000,
    "Expenses": 10000,
    "Balance": 30000
  },
  {
    "Date": "2025-07-11",
    "OBR No.": "OBR-004",
    "Particulars": "Procurement of equipment",
    "Appropriation/ Allotment": 100000,
    "Expenses": 75000,
    "Balance": 25000
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
      'EXEC SP_SAAOB @startDate = :startDate, @endDate = :endDate, @fiscalID = :fiscalYear, @fundID = :fundID, @dep = :departmentID',
      {
        replacements: { startDate, endDate, fiscalYear: fiscalYearID, fundID: fundsID, departmentID: departmentID || '%' },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const formattedResults = results.map(row => ({
      "Fund": row.Fund,
      "Year": row['Fiscal Year'],
      "Month End": row['End Date'], // Mapping End Date to Month End
      "Account Code": row.AccountCode,
      "ID": row.ID,
      "Category": row.Subtype, // Mapping Subtype to Category
      "Name": row.Name,
      "Appropriation": row.Appropriation,
      "Allotment": row.Allotment,
      "Obligation": row.Obligation,
      "Unobligated Appropriation": (row.Appropriation || 0) - (row.Allotment || 0),
      "Unobligated Allotment": (row.Allotment || 0) - (row.Obligation || 0),
      "Municipality": "Passi City", // Hardcoded per user context or generic
      "Province": "Iloilo", // Hardcoded per user context
      "Requested By": "", // Not returned by SP
      "Position": "" // Not returned by SP
    }));

    return res.json(formattedResults);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.viewSAO = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      fiscalYearID,
      fundsID,
      departmentID,
    } = req.body;

    const results = await sequelize.query(
      'EXEC SP_SAO @startDate = :startDate, @endDate = :endDate, @fiscalID = :fiscalYear, @fundID = :fundID, @dep = :departmentID',
      {
        replacements: { startDate, endDate, fiscalYear: fiscalYearID, fundID: fundsID, departmentID: departmentID || '%' },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const formattedResults = results.map(row => ({
      "Date": row['Invoice Date'],
      "OBR No.": row['Invoice Number'],
      "Particulars": row.Particulars,
      "Appropriation/ Allotment": row.Appropriation,
      "Expenses": row.Obligation,
      "Balance": row.Balance
    }));

    return res.json(formattedResults);
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
      'EXEC SP_SAAOB @startDate = :startDate, @endDate = :endDate, @fiscalID = :fiscalYear, @fundID = :fundID, @dep = :departmentID',
      {
        replacements: { startDate, endDate, fiscalYear: fiscalYearID, fundID: fundsID, departmentID: departmentID || '%' },
      }
    );

    const filename = `Statement_of_Appropriations_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(results, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => { if (err) fs.unlinkSync(filePath); });
  } catch (err) {
    console.log('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};