const { sequelize } = require('../config/database');
const ChartofAccounts = require('../config/database').ChartofAccounts;
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Disbursement Journal');

  // Define columns based on DisbursementJournalPage.jsx
  worksheet.columns = [
    { header: 'Municipality', key: 'Municipality', width: 20 },
    { header: 'Funds', key: 'Funds', width: 20 },
    { header: 'Date', key: 'Date', width: 15 },
    { header: 'Check No.', key: 'CheckNo', width: 15 },
    { header: 'Voucher No.', key: 'VoucherNo', width: 15 },
    { header: 'JEV No.', key: 'JEVNo', width: 15 },
    { header: 'Claimant', key: 'Claimant', width: 25 },
    { header: 'Particulars', key: 'Particulars', width: 35 },
    { header: 'Account Code', key: 'AccountCode', width: 15 },
    { header: 'Debit', key: 'Debit', width: 15 },
    { header: 'Credit', key: 'Credit', width: 15 },
    { header: 'Approver', key: 'Approver', width: 20 },
    { header: 'Position', key: 'Position', width: 20 },
    { header: 'Start Date', key: 'StartDate', width: 15 },
    { header: 'End Date', key: 'EndDate', width: 15 },
  ];

  // Map data to match keys and handle formatting
  const rows = data.map(item => ({
    ...item,
    Date: item.Date ? new Date(item.Date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    Debit: Number(item.Debit || 0),
    Credit: Number(item.Credit || 0),
    StartDate: item.StartDate ? new Date(item.StartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    EndDate: item.EndDate ? new Date(item.EndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
  }));

  worksheet.addRows(rows);

  // Format numeric columns
  ['J', 'K'].forEach(colKey => {
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
    "Municipality": "DUENAS",
    "Funds": "General Fund",
    "Date": "2025-06-28T00:00:00.000Z",
    "CheckNo": "CHK-1025",
    "VoucherNo": "INV-5582",
    "JEVNo": "INV-5582",
    "Claimant": "Juan D. Dela Cruz /",
    "Particulars": "Office Supplies, Printer Ink, A4 Paper",
    "AccountCode": "10101001",
    "Debit": 15000.00,
    "Credit": null,
    "Approver": "Maria L. Reyes",
    "Position": "Municipal Treasurer",
    "StartDate": "2025-06-01",
    "EndDate": "2025-06-30",
    "a": 1
  },
  {
    "Municipality": "DUENAS",
    "Funds": "All Funds",
    "Date": "2025-06-25T00:00:00.000Z",
    "CheckNo": "CHK-1026",
    "VoucherNo": "INV-5583",
    "JEVNo": "INV-5583",
    "Claimant": "Pedro M. Santos /",
    "Particulars": "Consulting Services, Legal Fees",
    "AccountCode": "20202002",
    "Debit": null,
    "Credit": 10000.00,
    "Approver": "Elena G. Rivera",
    "Position": "Municipal Accountant",
    "StartDate": "2025-06-01",
    "EndDate": "2025-06-30",
    "a": 1
  },
  {
    "Municipality": "DUENAS",
    "Funds": "Special Education Fund",
    "Date": "2025-06-27T00:00:00.000Z",
    "CheckNo": "CHK-1027",
    "VoucherNo": "INV-5584",
    "JEVNo": "INV-5584",
    "Claimant": "VendorCorp Inc. /",
    "Particulars": "Books, Chalk, Whiteboards",
    "AccountCode": "30303003",
    "Debit": 8500.00,
    "Credit": null,
    "Approver": "Carlos T. Mendoza",
    "Position": "Budget Officer",
    "StartDate": "2025-06-01",
    "EndDate": "2025-06-30",
    "a": 1
  }
];

exports.view = async (req, res) => {
  try {
    console.error(req.body);
    const {
      DisbursementType,
      DateStart,
      DateEnd,
      FundID,
      ChartOfAccountID
    } = req.body;

    const modeOfPayment = DisbursementType;

    const startDate = DateStart;
    const endDate = DateEnd;
    const fundID = FundID;

    const chartOfAccounts = await ChartofAccounts.findByPk(ChartOfAccountID);

    let code = null;
    if (chartOfAccounts) {
      code = chartOfAccounts.AccountCode;
    }

    let results = [];
    if (modeOfPayment === 'Check' || modeOfPayment === 'Cash') {
      results = await sequelize.query(
        'CALL SP_DisbursementJournal(:modeOfPayment, :startDate, :endDate, :fundID, :code)',
        {
          replacements: {
            modeOfPayment,
            startDate,
            endDate,
            fundID,
            code
          }
        }
      );
    } else if (modeOfPayment === 'General') {
      results = await sequelize.query(
        'CALL SP_GeneralJournal(:startDate, :endDate, :fundID, :code)',
        {
          replacements: {
            startDate,
            endDate,
            fundID,
            code
          }
        }
      );
    } else if (modeOfPayment === 'Collection') {
      throw new Error('Collection Journal is currently unavailable ! ! !');
    } else {
      throw new Error('Invalid Disbursement Type');
    }

    return res.json(results);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    console.error(req.body);
    const {
      DisbursementType,
      DateStart,
      DateEnd,
      FundID,
      ChartOfAccountID
    } = req.body;

    const modeOfPayment = DisbursementType;
    const fundID = FundID;
    const startDate = DateStart;
    const endDate = DateEnd;

    const chartOfAccounts = await ChartofAccounts.findByPk(ChartOfAccountID);

    let code = null;
    if (chartOfAccounts) {
      code = chartOfAccounts.AccountCode;
    }

    let results = [];
    if (DisbursementType === 'Check' || DisbursementType === 'Cash') {
      results = await sequelize.query(
        'CALL SP_DisbursementJournal(:modeOfPayment, :startDate, :endDate, :fundID, :code)',
        {
          replacements: {
            modeOfPayment,
            startDate,
            endDate,
            fundID,
            code
          }
        }
      );
    } else if (DisbursementType === 'General') {
      results = await sequelize.query(
        'CALL SP_GeneralJournal(:startDate, :endDate, :fundID, :code)',
        {
          replacements: {
            startDate,
            endDate,
            fundID,
            code
          }
        }
      );
    } else if (DisbursementType === 'Collection') {
      throw new Error('Collection Journal is currently unavailable ! ! !');
    } else {
      throw new Error('Invalid Disbursement Type');
    }

    // Robust way to handle both [rows, metadata] and direct rows from DB result
    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    }

    const filename = `Disbursement_Journals_${DisbursementType}_${Date.now()}.xlsx`;
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
    console.error('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};