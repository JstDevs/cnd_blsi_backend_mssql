const { sequelize } = require('../config/database');
const ChartofAccounts = require('../config/database').ChartofAccounts;
const path = require('path');
const ExcelJS = require('exceljs');
const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Disbursement Journal');
  worksheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  worksheet.addRows(data);
  worksheet.columns.forEach(col => col.width = col.header.length < 12 ? 12 : col.header.length);
  const filePath = path.join(__dirname, `../public/exports/${filename}`);
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
    
    const filename = `Disbursement_Journals_${DisbursementType}_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(results, filename);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, err => { if (err) fs.unlinkSync(filePath); });
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    res.status(500).json({ error: err.message });
  }
};