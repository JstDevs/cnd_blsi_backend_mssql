const sequelize = require('../config/database').sequelize;
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const { Op, fn, col, literal } = require('sequelize');
const db = require("../config/database");
const { getAllWithAssociations } = require('../models/associatedDependency');
const exportToExcel = async (data, filename, columns) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Collection Report');

  worksheet.columns = columns;

  // Map data to match keys and handle formatting
  const rows = data.map(item => {
    const row = { ...item };
    // Common date formatting if keys exist
    if (row.Date) row.Date = new Date(row.Date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    if (row.Date1) row.Date1 = new Date(row.Date1).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    if (row.Date2) row.Date2 = new Date(row.Date2).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    if (row.InvoiceDate) row.InvoiceDate = new Date(row.InvoiceDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    if (row.StartDate) row.StartDate = new Date(row.StartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    if (row.EndDate) row.EndDate = new Date(row.EndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

    // Ensure numbers are numbers
    if (row.SubTotal) row.SubTotal = Number(row.SubTotal);
    if (row.Total) row.Total = Number(row.Total);
    if (row.First) row.First = Number(row.First);
    if (row.Second) row.Second = Number(row.Second);
    if (row.Third) row.Third = Number(row.Third);

    return row;
  });

  worksheet.addRows(rows);

  // Apply currency formatting to numeric columns dynamically
  worksheet.columns.forEach((col, idx) => {
    const header = col.header.toLowerCase();
    if (header.includes('amount') || header.includes('total') || header.includes('quarter') || header.includes('debit') || header.includes('credit') || header.includes('balance')) {
      worksheet.getColumn(idx + 1).numFmt = '#,##0.00;[Red](#,##0.00)';
    }
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

const mockDataDaily = [
  {
    "ChargeAccountID": 101,
    "FundsID": 1,
    "Name": "Office Supplies",
    "Account": "50203010",
    "SubTotal": 1500.00,
    "Date": "2025-07-10",
    "FullName": "Maria Reyes",
    "Position": "Accounting Officer"
  },
  {
    "ChargeAccountID": 102,
    "FundsID": 2,
    "Name": "Travel Expenses",
    "Account": "50201020",
    "SubTotal": 3200.50,
    "Date": "2025-07-09",
    "FullName": "Juan Dela Cruz",
    "Position": "Finance Assistant"
  },
  {
    "ChargeAccountID": 103,
    "FundsID": 1,
    "Name": "Utilities",
    "Account": "50302030",
    "SubTotal": 2750.75,
    "Date": "2025-07-08",
    "FullName": "Ana Santos",
    "Position": "Treasury Clerk"
  },
  {
    "ChargeAccountID": 104,
    "FundsID": 3,
    "Name": "Training and Development",
    "Account": "50604050",
    "SubTotal": 4500.00,
    "Date": "2025-07-07",
    "FullName": "Carlos Mendoza",
    "Position": "HR Officer"
  }
];

const mockDataMonthly = [
  {
    "ChargeAccountID": 201,
    "FundsID": 1,
    "Name": "Purchase of IT Equipment",
    "ChartOfAccounts": "70501020",
    "SubTotal": 85000.00,
    "Month": "July",
    "Year": 2025,
    "Date1": "2025-07-01",
    "Date2": "2025-07-05",
    "FullName": "Elena Cruz",
    "Position": "Procurement Officer"
  },
  {
    "ChargeAccountID": 202,
    "FundsID": 2,
    "Name": "Building Repairs",
    "ChartOfAccounts": "70603015",
    "SubTotal": 125000.00,
    "Month": "July",
    "Year": 2025,
    "Date1": "2025-07-03",
    "Date2": "2025-07-06",
    "FullName": "Mark Dizon",
    "Position": "Engineer II"
  },
  {
    "ChargeAccountID": 203,
    "FundsID": 3,
    "Name": "Utility Bills - Electricity",
    "ChartOfAccounts": "70704010",
    "SubTotal": 18500.75,
    "Month": "July",
    "Year": 2025,
    "Date1": "2025-07-04",
    "Date2": "2025-07-08",
    "FullName": "Lorna Garcia",
    "Position": "Accounting Clerk"
  },
  {
    "ChargeAccountID": 204,
    "FundsID": 4,
    "Name": "Training Seminar",
    "ChartOfAccounts": "70805025",
    "SubTotal": 35000.00,
    "Month": "July",
    "Year": 2025,
    "Date1": "2025-07-02",
    "Date2": "2025-07-10",
    "FullName": "Joel Ramirez",
    "Position": "HR Coordinator"
  }
];

const mockDataQuarterly = [
  {
    "ChargeAccountID": 101,
    "FundsID": 1,
    "FundName": "General Fund",
    "Name": "Purchase of Office Supplies",
    "ChartOfAccounts": "60101010",
    "Total": 25000.00,
    "FullName": "Maria Santos",
    "Position": "Budget Officer",
    "Year": 2025,
    "1stQuarter": 8000.00,
    "2ndQuarter": 9000.00,
    "3rdQuarter": 8000.00,
    "Quarter": "2nd Quarter",
    "First": 8000.00,
    "Second": 9000.00,
    "Third": 8000.00
  },
  {
    "ChargeAccountID": 102,
    "FundsID": 2,
    "FundName": "Special Education Fund",
    "Name": "School Maintenance",
    "ChartOfAccounts": "60202015",
    "Total": 40000.00,
    "FullName": "Carlos Reyes",
    "Position": "Education Officer",
    "Year": 2025,
    "1stQuarter": 15000.00,
    "2ndQuarter": 10000.00,
    "3rdQuarter": 15000.00,
    "Quarter": "3rd Quarter",
    "First": 15000.00,
    "Second": 10000.00,
    "Third": 15000.00
  },
  {
    "ChargeAccountID": 103,
    "FundsID": 3,
    "FundName": "Trust Fund",
    "Name": "Community Program",
    "ChartOfAccounts": "60303020",
    "Total": 30000.00,
    "FullName": "Liza Villanueva",
    "Position": "Program Coordinator",
    "Year": 2025,
    "1stQuarter": 10000.00,
    "2ndQuarter": 10000.00,
    "3rdQuarter": 10000.00,
    "Quarter": "1st Quarter",
    "First": 10000.00,
    "Second": 10000.00,
    "Third": 10000.00
  },
  {
    "ChargeAccountID": 104,
    "FundsID": 4,
    "FundName": "Disaster Risk Fund",
    "Name": "Emergency Response Equipment",
    "ChartOfAccounts": "60404030",
    "Total": 50000.00,
    "FullName": "John dela Cruz",
    "Position": "DRRM Officer",
    "Year": 2025,
    "1stQuarter": 20000.00,
    "2ndQuarter": 15000.00,
    "3rdQuarter": 15000.00,
    "Quarter": "1st Quarter",
    "First": 20000.00,
    "Second": 15000.00,
    "Third": 15000.00
  }
];

const mockDataFlexible = [
  {
    "Municipality": "Angadanan",
    "Province": "Isabela",
    "StartDate": "2025-01-01",
    "EndDate": "2025-03-31",
    "InvoiceDate": "2025-01-15",
    "Total": 15000.00,
    "InvoiceNumber": "INV-2025-001",
    "CustomerName": "Juan Dela Cruz",
    "Poster": "Anna Reyes",
    "Prepare": "Michael Santos",
    "Note": "Processed for payment",
    "PreparePosition": "Accounting Clerk",
    "NotedPosition": "Municipal Treasurer"
  },
  {
    "Municipality": "Cauayan City",
    "Province": "Isabela",
    "StartDate": "2025-04-01",
    "EndDate": "2025-06-30",
    "InvoiceDate": "2025-04-10",
    "Total": 23500.00,
    "InvoiceNumber": "INV-2025-045",
    "CustomerName": "Maria Lopez",
    "Poster": "Bryan Cruz",
    "Prepare": "Catherine Gomez",
    "Note": "Cleared for disbursement",
    "PreparePosition": "Bookkeeper",
    "NotedPosition": "City Accountant"
  },
  {
    "Municipality": "Ramon",
    "Province": "Isabela",
    "StartDate": "2025-07-01",
    "EndDate": "2025-09-30",
    "InvoiceDate": "2025-07-05",
    "Total": 18750.00,
    "InvoiceNumber": "INV-2025-078",
    "CustomerName": "Jose Rizal",
    "Poster": "Liza Flores",
    "Prepare": "Nico Morales",
    "Note": "Pending mayor's approval",
    "PreparePosition": "Finance Officer",
    "NotedPosition": "Budget Officer"
  }
];


exports.getCollectionSummaryDaily = async (req, res) => {
  try {
    const { date, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };

    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Daily :date, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          date,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
      }
    );

    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    }
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getCollectionSummaryMonthly = async (req, res) => {
  try {
    const { month, year, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };

    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Monthly :month, :year, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          month,
          year,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
      }
    );

    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    }
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCollectionSummaryQuarterly = async (req, res) => {
  try {
    const { quarter, year, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };

    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Quarterly :quarter, :year, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          quarter,
          year,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
      }
    );

    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    }
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCollectionSummaryFlexible = async (req, res) => {
  try {
    const { startdate, enddate, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };

    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Flexible :startdate, :enddate, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          startdate,
          enddate,
          // user: req.user.employeeID,
          // note,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
      }
    );

    let rows = [];
    if (Array.isArray(results)) {
      if (results.length > 0 && Array.isArray(results[0])) {
        rows = results[0];
      } else {
        rows = results;
      }
    }
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.exportExcelDaily = async (req, res) => {
  try {
    const { date, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };

    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Daily :date, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          date,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
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

    const columns = [
      { header: 'Date', key: 'Date', width: 15 },
      { header: 'Account No.', key: 'Account', width: 15 },
      { header: 'Name', key: 'Name', width: 30 },
      { header: 'Amount', key: 'SubTotal', width: 15 },
      { header: 'Prepared By', key: 'FullName', width: 25 },
    ];

    const filename = `Collection_Report_Daily_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(rows, filename, columns);
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

exports.exportExcelMonthly = async (req, res) => {
  try {
    const { month, year, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };

    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Monthly :month, :year, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          month,
          year,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
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

    const columns = [
      { header: 'Month', key: 'Month', width: 15 },
      { header: 'Year', key: 'Year', width: 10 },
      { header: 'Chart of Accounts', key: 'ChartOfAccounts', width: 20 },
      { header: 'Name', key: 'Name', width: 30 },
      { header: 'Amount', key: 'SubTotal', width: 15 },
      { header: 'Prepared By', key: 'FullName', width: 25 },
    ];

    const filename = `Collection_Report_Monthly_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(rows, filename, columns);
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

exports.exportExcelQuarterly = async (req, res) => {
  try {
    const { quarter, year, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };


    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Quarterly :quarter, :year, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          quarter,
          year,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
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

    const columns = [
      { header: 'Fund', key: 'FundName', width: 20 },
      { header: 'Account', key: 'ChartOfAccounts', width: 20 },
      { header: 'Name', key: 'Name', width: 30 },
      { header: '1st Quarter', key: 'First', width: 15 },
      { header: '2nd Quarter', key: 'Second', width: 15 },
      { header: '3rd Quarter', key: 'Third', width: 15 },
      { header: 'Total', key: 'Total', width: 15 },
    ];

    const filename = `Collection_Report_Quarterly_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(rows, filename, columns);
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

exports.exportExcelFlexible = async (req, res) => {
  try {
    const { startdate, enddate, user, note, ctc, btc, mrc, gsi, rpt, pmt } = req.query;

    // Convert checkbox values to actual DocumentTypeIDs (or -1 if unchecked)
    const checkboxFlags = {
      ctc: ctc ? 5 : -1,
      btc: btc ? 18 : -1,
      mrc: mrc ? 19 : -1,
      gsi: gsi ? 6 : -1,
      rpt: rpt ? 11 : -1,
      pmt: pmt ? 30 : -1,
    };


    const results = await sequelize.query(
      'EXEC SP_SummaryOfCollection_Flexible :startdate, :enddate, :user, :note, :ctc, :btc, :mrc, :gsi, :rpt, :pmt',
      {
        replacements: {
          startdate,
          enddate,
          user: req.user.employeeID,
          note,
          ctc: checkboxFlags.ctc,
          btc: checkboxFlags.btc,
          mrc: checkboxFlags.mrc,
          gsi: checkboxFlags.gsi,
          rpt: checkboxFlags.rpt,
          pmt: checkboxFlags.pmt,
        },
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

    const columns = [
      { header: 'Invoice Date', key: 'InvoiceDate', width: 15 },
      { header: 'Invoice No.', key: 'InvoiceNumber', width: 15 },
      { header: 'Customer', key: 'CustomerName', width: 25 },
      { header: 'Note', key: 'Note', width: 35 },
      { header: 'Total', key: 'Total', width: 15 },
    ];

    const filename = `Collection_Report_Flexible_${Date.now()}.xlsx`;
    const filePath = await exportToExcel(rows, filename, columns);
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