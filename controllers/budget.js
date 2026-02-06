const { Budget } = require('../config/database');
const budget = Budget
const { Op } = require('sequelize');

const { getAllWithAssociations } = require("../models/associatedDependency");
const db = require('../config/database')
const { sequelize, TransactionTable, Attachment, ApprovalAudit, documentType, ApprovalMatrix } = require('../config/database');
const item = require('../models/item');
exports.create = async (req, res) => {
  try {
    const { FiscalYearID, FundID, ProjectID, Name, DepartmentID, SubDepartmentID, ChartofAccountsID, Appropriation, TotalAmount, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = req.body;

    // Initialize balances if not explicitly provided
    const initialAppropriation = parseFloat(Appropriation || 0);
    const initialBalance = initialAppropriation;

    const item = await budget.create({
      FiscalYearID,
      FundID,
      ProjectID,
      Name,
      DepartmentID,
      SubDepartmentID,
      ChartofAccountsID,
      Appropriation: initialAppropriation,
      TotalAmount: initialAppropriation,
      AppropriationBalance: initialBalance,
      AllotmentBalance: 0, // Starts at 0 until released
      Active,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Budget create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(budget);
    let totalbalance = 0;
    let totalcharges = 0;
    let totalallotement = 0;
    let totalappropriations = 0;
    let totalbudgets = 0;
    for (let i = 0; i < items.length; i++) {
      totalbalance += items[i].AppropriationBalance ? parseFloat(items[i].AppropriationBalance) : 0;
      totalcharges += items[i].Charges ? parseFloat(items[i].Charges) : 0;
      totalallotement += items[i].AllotmentBalance ? parseFloat(items[i].AllotmentBalance) : 0;
      totalappropriations += items[i].Appropriation ? parseFloat(items[i].Appropriation) : 0;

    }
    res.json({
      status: true,
      items,
      totalbalance,
      totalcharges,
      totalallotement,
      totalappropriations,
      totalbudgets: items.length
    });
  } catch (err) {
    console.error('Budget getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await budget.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "budget not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { FiscalYearID, FundID, ProjectID, Name, DepartmentID, SubDepartmentID, ChartofAccountsID, Appropriation, TotalAmount, AppropriationBalance, Change, Supplemental, Transfer, Released, AllotmentBalance, ChargedAllotment, PreEncumbrance, Encumbrance, Charges, January, February, March, April, May, June, July, August, September, October, November, December, RevisedAmount, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = req.body;
    const [updated] = await budget.update({ FiscalYearID, FundID, ProjectID, Name, DepartmentID, SubDepartmentID, ChartofAccountsID, Appropriation, TotalAmount, AppropriationBalance, Change, Supplemental, Transfer, Released, AllotmentBalance, ChargedAllotment, PreEncumbrance, Encumbrance, Charges, January, February, March, April, May, June, July, August, September, October, November, December, RevisedAmount, Active, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') }, {
      where: { ID: req.params.id }
    });
    if (updated) {
      const updatedItem = await budget.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "budget not found" });
    }
  } catch (err) {
    console.error('Budget update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await budget.update({ Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') }, { where: { ID: req.params.id } });
    if (updated) res.json({ message: "budget deactivated" });
    else res.status(404).json({ message: "budget not found" });
  } catch (err) {
    console.error('Budget delete error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.createOrUpdateBudgetAllotment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      budgetId,
      amount,
      remarks,
      linkID,
      attachments = [],

      fiscalYear,
      departmentId,
      subDepartmentId,
      projectName,
      fundSource,
      userId
    } = req.body;

    const budgetRecord = await Budget.findOne({ where: { ID: budgetId }, transaction: t });
    if (!budgetRecord || !budgetRecord.Active) {
      await t.rollback();
      return res.status(400).json({ message: 'Invalid or inactive budget.' });
    }

    const appropriationBalance = budgetRecord.AppropriationBalance;
    if (parseFloat(amount) > appropriationBalance) {
      await t.rollback();
      return res.status(400).json({ message: 'Allotment exceeds appropriation balance.' });
    }

    let isNew = req.body.IsNew === 'true';
    let invoiceNumber = null;
    const approvalversion = await getLatestApprovalVersion('Budget Allotment', fiscalYear, departmentId, subDepartmentId)
    const docID = 20
    if (isNew) {
      const docType = await documentType.findOne({ where: { ID: docID }, transaction: t });
      invoiceNumber = `${docType.Prefix}-${docType.CurrentNumber}-${docType.Suffix}`;
      await TransactionTable.create({
        LinkID: linkID,
        BudgetID: budgetId,
        FiscalYear: fiscalYear,
        DepartmentID: departmentId,
        SubDepartmentID: subDepartmentId,
        ProjectName: projectName,
        FundSource: fundSource,
        InvoiceNumber: invoiceNumber,
        Total: amount,
        Remarks: remarks,
        CreatedBy: req.user.name,
        CreatedDate: db.sequelize.fn('GETDATE'),
        RequestedBy: userId,
        Status: 'Requested',
        DocumentTypeID: 20,
        Active: true,
        ApprovalProgress: 0,
        ApprovalVersion: approvalversion,
        APAR: 'Allotment Release Order'
      }, { transaction: t });

      await docType.update({ CurrentNumber: docType.CurrentNumber + 1 }, { transaction: t });
    } else {
      await TransactionTable.update({
        ModifyBy: req.user.name,
        ModifyDate: db.sequelize.fn('GETDATE'),
        Total: amount,
        Remarks: remarks,
        ApprovalProgress: 0,
        Status: 'Requested'
      }, { where: { LinkID: linkID }, transaction: t });

      await Attachment.destroy({ where: { LinkID: linkID }, transaction: t });
    }

    for (const file of attachments) {
      await Attachment.create({
        LinkID: linkID,
        DataImage: file.buffer,
        DataName: file.originalname,
        DataType: file.mimetype
      }, { transaction: t });
    }

    await ApprovalAudit.create({
      LinkID: linkID,
      InvoiceLink: linkID,
      PositionOrEmployee: 'Employee',
      PositionOrEmployeeID: req.user.employeeId,
      SequenceOrder: 1,
      ApprovalOrder: 1,
      ApprovalDate: db.sequelize.fn('GETDATE'),
      CreatedBy: req.user.name,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ApprovalVersion: approvalversion
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Budget allotment saved successfully.' });

  } catch (err) {
    if (t) await t.rollback();
    console.error('Error in budget allotment flow:', err);
    res.status(500).json({ message: 'An error occurred.', error: err.message });
  }
}
// async function getLatestApprovalVersion(documentType = 'Budget Allotment', fiscalYear, departmentId, subDepartmentId) {

//   const result = await ApprovalMatrix.findOne({
//     where: {
//       DocumentType: documentType,
//       Active: true
//     },
//     order: [['Version', 'DESC']]
//   });

//   return result ? result.Version : null;
// }


async function getNextInvoiceNumber(documentTypeId) {
  const docType = await DocumentType.findByPk(documentTypeId);
  const nextNumber = docType.CurrentNumber + 1;
  await docType.update({ CurrentNumber: nextNumber });
  return `${docType.Code}-${nextNumber}`;
}

// Helper to get latest approval version
async function getLatestApprovalVersion(name) {
  const latest = await ApprovalMatrix.findOne({
    include: [{
      model: db.documentType,
      as: "DocumentType",
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('DocumentType.Name')),
        'like',
        `%${name}%`
      )
    }],
    where: { Active: true },
    order: [['Version', 'DESC']],
    raw: true
  });

  if (!latest || !latest.Version) {
    return 1.0
  }
  console.log("latest.Version", latest.Version, latest);
  return latest.Version;
}

exports.getAllotmentList = async (req, res) => {
  try {
    console.log("getAllotmentList");
    let totalallotment = 0;
    let totalorders = 0;
    let totalappropriations = 0;
    let remainingbalance = 0
    let PENDING = 0;
    const allotments = await TransactionTable.findAll({
      include: [
        {
          model: Budget,
          as: 'Budget'
        }
      ],
      where: {
        Active: true,
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('TransactionTable.APAR')),
            'like',
            '%Allotment Release Order%'
          )
        ]
      },
      order: [['CreatedDate', 'DESC']]
    });

    for (let i = 0; i < allotments.length; i++) {
      totalallotment += parseFloat(allotments[i].Total);
      totalorders += parseFloat(allotments[i].Total);
      totalappropriations += parseFloat(allotments[i].Budget.Appropriation);
      remainingbalance += parseFloat(allotments[i].Budget.AppropriationBalance);
      PENDING += parseFloat(allotments[i].Budget.AppropriationBalance) < 0 ? 0 : parseFloat(allotments[i].Budget.AppropriationBalance);
    }

    // res.locals.totalallotment = totalallotment;
    // res.locals.totalorders = totalorders;
    // res.locals.totalappropriations = totalappropriations;
    // res.locals.remainingbalance = remainingbalance;
    // res.locals.PENDING = PENDING;
    return res.json({
      success: true, data: allotments,
      totalallotment,
      totalorders: allotments.length,
      totalappropriations,
      remainingbalance,
      PENDING
    });
  } catch (err) {
    console.error('Error loading allotment list:', err);
    return res.status(500).json({ success: false, message: 'Error loading data', error: err.message });
  }
}

exports.budgetlist = async (req, res) => {
  try {
    const userDepartmentID = parseInt(req.query.userDepartmentID);

    const whereClause = {
      Active: true
    };

    // if (![1, 2, 3, 4].includes(userDepartmentID)) {
    //   whereClause.DepartmentID = userDepartmentID;
    // }
    let totalbudget = 0;
    let totalutilized = 0;
    let totalappropriations = 0;
    let remainingbalance = 0

    const budgets = await Budget.findAll({
      include: [
        { model: db.FiscalYear, as: "FiscalYear" },
        { model: db.department, as: "Department" },
        { model: db.subDepartment, as: "SubDepartment" },
        { model: db.ChartofAccounts, as: "ChartofAccounts" },
        { model: db.Funds, as: "Funds" },
        { model: db.Project, as: "Project" }
      ],
      where: whereClause,
      order: [['CreatedDate', 'DESC']]
    });
    for (let i = 0; i < budgets.length; i++) {
      totalbudget += budgets[i].TotalAmount;
      let diff = budgets[i].TotalAmount - budgets[i].Released
      totalutilized += diff
      totalappropriations += parseFloat(budgets[i].Appropriation);
      remainingbalance += parseFloat(budgets[i].AppropriationBalance);
    }
    // res.locals.totalallotment = totalallotment;
    // res.locals.totalorders = totalorders;
    // res.locals.totalappropriations = totalappropriations;
    // res.locals.remainingbalance = remainingbalance;
    // res.locals.PENDING = PENDING;

    return res.json({
      success: true, data: budgets,
      totalbudget: budgets.length,
      totalutilized,
      totalappropriations,
      remainingbalance
    });
  } catch (err) {
    console.error('Error loading budget list:', err);
    return res.status(500).json({ success: false, message: 'Error loading budget data', error: err.message });
  }
}

function generateLinkID() {
  return new Date().toISOString().replace(/\D/g, '');
}

exports.saveBudgetSupplemental = async (req, res) => {
  // for edit case
  const {
    txtAmount,
    txtRemarks,
    lngUser,
    varID,
    dtAttachments,
    isNew,       // boolAdd in VB
    strUser,
    varLink } = req.body
  // const { lngUser, strUser, isNew, txtAmount, txtRemarks, txtBudgetID } = req.body;
  if (txtAmount === '0.00') {
    throw new Error('Please enter a valid supplemental value!');
  }

  const t = await sequelize.transaction();
  const linkID = generateLinkID();
  let invoiceText = 'error';
  let transactionLog = [];

  try {
    if (isNew) {
      const docID = 2 //21
      const docType = await db.documentType.findByPk(docID);
      invoiceText = `${docType?.Prefix}-${docType?.CurrentNumber}-${docType?.Suffix}`;

      const approvalMatrix = await db.ApprovalMatrix.findOne({
        where: { DocumentTypeID: docID, Active: true },
        order: [['Version', 'DESC']]
      });

      if (!approvalMatrix) {
        throw new Error('Approval workflow not found.');
      }

      await TransactionTable.create({
        LinkID: linkID,
        Status: 'Requested',
        APAR: 'Budget Supplemental',
        DocumentTypeID: 21,
        RequestedBy: lngUser,
        InvoiceDate: new Date(),
        InvoiceNumber: invoiceText,
        Total: parseFloat(txtAmount),
        Active: true,
        Remarks: txtRemarks,
        CreatedBy: strUser,
        CreatedDate: new Date(),
        ApprovalProgress: 0,
        BudgetID: varID,
        ApprovalVersion: approvalMatrix.Version
      }, { transaction: t });

      await docType.update({ CurrentNumber: docType.CurrentNumber + 1 }, { transaction: t });

      transactionLog.push('Created new supplemental transaction');
    } else {
      await TransactionTable.update({
        ModifyBy: strUser,
        ModifyDate: new Date(),
        Total: parseFloat(txtAmount),
        Remarks: txtRemarks,
        ApprovalProgress: 0,
        Status: 'Requested'
      }, {
        where: { LinkID: varLink },
        transaction: t
      });

      await Attachment.destroy({ where: { LinkID: varLink }, transaction: t });

      transactionLog.push('Updated existing transaction');
    }

    // Save attachments
    for (const row of dtAttachments) {
      await Attachment.create({
        LinkID: isNew ? linkID : varLink,
        DataImage: row['Data Image'],    // Binary buffer
        DataName: row['Data Name'],
        DataType: row['Data Type']
      }, { transaction: t });
    }

    await t.commit();
    return res.json({ success: true, message: 'Supplemental saved successfully', log: transactionLog });

  } catch (err) {
    await t.rollback();
    console.error('Error saving supplemental:', err);
    return { success: false, message: err.message, log: transactionLog };
  }
}

// GET /api/transactions/budget-supplemental
exports.budgetsupplemental = async (req, res) => {
  try {
    const transactions = await TransactionTable.findAll({
      include: [
        {
          model: Budget,
          as: "Budget"
        }
      ],
      where: {
        Active: true,
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('TransactionTable.APAR')),
            'like',
            '%budget supplemental%'
          )
        ]
      },
      order: [['CreatedDate', 'DESC']],
      attributes: [
        'ID',
        'LinkID',
        'Status',
        'InvoiceNumber',
        'InvoiceDate',
        'Total',
        'Remarks',
        'ApprovalProgress',
        'ApprovalVersion'
      ]
    });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error loading budget supplemental list:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading data',
      error: error.message
    });
  }
}


function generateLinkID() {
  return new Date().toISOString().replace(/\D/g, '');
}


exports.saveBudgetTransfer = async (req, res) => {

  const {
    txtAmount1,
    txtAppropriationBalance1,
    txtRemarks1,
    dtAttachments,
    varID1,
    varID2,
    strUser,
    lngUser,
    varLink,
    isNew
  } = req.body;
  const amount = parseFloat(txtAmount1);
  const maxValue = parseFloat(txtAppropriationBalance1);
  let transactionLog = [];
  let linkID = generateLinkID();
  let invoiceText = 'error';

  if (amount === 0.0) throw new Error('Enter a proper allotment value!');
  if (amount > maxValue) throw new Error(`Transfer cannot exceed remaining budget: ${maxValue}`);
  if (!varID1 || !varID2) throw new Error('Source and Target budget IDs must be selected.');

  const t = await sequelize.transaction();
  const docID = 2
  try {
    if (isNew) {
      const docType = await db.documentType.findByPk(docID);
      invoiceText = `${docType.Prefix}-${docType.CurrentNumber}-${docType.Suffix}`;

      const approvalMatrix = await ApprovalMatrix.findOne({
        where: { DocumentTypeID: docID, Active: true },
        order: [['Version', 'DESC']]
      });
      if (!approvalMatrix) throw new Error('No approval matrix for Budget Transfer.');

      await TransactionTable.create({
        LinkID: linkID,
        Status: 'Requested',
        APAR: 'Budget Transfer',
        DocumentTypeID: 22,
        RequestedBy: lngUser,
        InvoiceDate: new Date(),
        InvoiceNumber: invoiceText,
        Total: amount,
        Active: true,
        Remarks: txtRemarks1,
        CreatedBy: strUser,
        CreatedDate: new Date(),
        ApprovalProgress: 0,
        BudgetID: varID1,
        TargetID: varID2,
        ApprovalVersion: approvalMatrix.Version
      }, { transaction: t });

      await docType.update({ CurrentNumber: docType.CurrentNumber + 1 }, { transaction: t });
      transactionLog.push('New budget transfer created');

    } else {
      await TransactionTable.update({
        ModifyBy: strUser,
        ModifyDate: new Date(),
        Total: amount,
        Remarks: txtRemarks1,
        BudgetID: varID1,
        TargetID: varID2,
        ApprovalProgress: 0,
        Status: 'Requested'
      }, {
        where: { LinkID: varLink },
        transaction: t
      });

      await Attachment.destroy({ where: { LinkID: varLink }, transaction: t });
      linkID = varLink; // use existing link
      transactionLog.push('Existing transfer updated');
    }

    // Process attachments
    for (const row of dtAttachments) {
      await Attachment.create({
        LinkID: linkID,
        DataImage: row['Data Image'],   // Should be a Buffer
        DataName: row['Data Name'],
        DataType: row['Data Type']
      }, { transaction: t });

      transactionLog.push(`Attachment added: ${row['Data Name']}`);
    }

    await t.commit();
    return res.json({
      success: true,
      message: 'Budget Transfer saved successfully.',
      transactionLog
    });
  } catch (err) {
    await t.rollback();
    console.error('Error saving budget transfer:', err);
    return res.json({
      success: false,
      message: err.message,
      transactionLog
    });
  }
}
exports.budgettransfer = async (req, res) => {
  try {
    let totaltransefer = 0;
    let pendingapproval = 0
    let approved = 0
    let totalamount = 0
    const transfers = await TransactionTable.findAll({
      include: [
        {
          model: Budget,
          as: "Budget"
        },
        {
          model: Budget,
          as: "Target"
        }
      ],
      where: {
        Active: true,
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('TransactionTable.APAR')),
            'like',
            '%budget transfer%'
          )
        ]
      },
      order: [['CreatedDate', 'DESC']]
    });
    for (let i = 0; i < transfers.length; i++) {
      totaltransefer += parseFloat(transfers[i].Total);
      if (transfers[i].Status == 'Requested') {
        pendingapproval += 1
      }
      if (transfers[i].Status == 'Approved') {
        approved += 1
      }
      totalamount += transfers[i].Total
    }
    const computedTransfers = transfers.map(record => {
      const t = record.toJSON();
      const transferAmount = parseFloat(t.Total) || 0;

      const sourceBalance = parseFloat(t.Budget?.AllotmentBalance || 0);
      const targetBalance = parseFloat(t.Target?.AllotmentBalance || 0);

      return {
        ...t,
        SourceBudget: {
          ID: t.Budget?.ID,
          Name: t.Budget?.Name,
          CurrentBalance: sourceBalance,
          RemainingBalance: sourceBalance - transferAmount
        },
        TargetBudget: {
          ID: t.Target?.ID,
          Name: t.Target?.Name,
          CurrentBalance: targetBalance,
          RemainingBalance: targetBalance + transferAmount
        }
      };
    });
    res.status(200).json({
      success: true, data: computedTransfers,
      totaltransefer: transfers.length,
      pendingapproval,
      approved,
      totalamount
    });
  } catch (error) {
    console.error('Error loading budget transfers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load transfer data',
      error: error.message
    });
  }
}


// routes/budgetReport.js



// Load dropdown options for departments, funds, and fiscal years
// router.get('/filters', async (req, res) => {
//   try {
//     const [departments, funds, fiscalYears] = await Promise.all([
//       Department.findAll({ where: { Active: true }, attributes: ['ID', 'Name'] }),
//       Fund.findAll({ where: { Active: true }, attributes: ['ID', 'Name'] }),
//       FiscalYear.findAll({ where: { Active: true }, attributes: ['ID', 'Name'] })
//     ]);

//     res.json({
//       departments,
//       funds,
//       fiscalYears
//     });
//   } catch (err) {
//     console.error('Error loading filter data:', err);
//     res.status(500).json({ message: 'Failed to load filters', error: err.message });
//   }
// });

// // Budget report execution using stored procedure
// router.post('/report', async (req, res) => {
//   const { startDate, endDate, departmentId, fiscalYearId, fundId } = req.body;
//   try {
//     const data = await sequelize.query(
//       'EXEC display_BudgetReport :startDate, :endDate, :depID, :fiscalYear, :fundID',
//       {
//         replacements: {
//           startDate,
//           endDate,
//           depID: departmentId,
//           fiscalYear: fiscalYearId,
//           fundID: fundId
//         },
//         type: QueryTypes.SELECT
//       }
//     );

//     res.json({ success: true, data });
//   } catch (error) {
//     console.error('Error running report:', error);
//     res.status(500).json({ success: false, message: 'Report generation failed', error: error.message });
//   }
// });

// // Export report to Excel
// router.post('/export', async (req, res) => {
//   const { reportData } = req.body;

//   try {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Budget Report');

//     if (reportData.length === 0) {
//       return res.status(400).json({ message: 'No data to export.' });
//     }

//     // Add headers
//     worksheet.columns = Object.keys(reportData[0]).map(key => ({ header: key, key }));

//     // Add data rows
//     reportData.forEach(row => worksheet.addRow(row));

//     worksheet.columns.forEach(col => col.width = 20);

//     const exportPath = path.join(__dirname, '../exports/budget-report.xlsx');
//     await workbook.xlsx.writeFile(exportPath);

//     res.download(exportPath, 'budget-report.xlsx');
//   } catch (err) {
//     console.error('Excel export failed:', err);
//     res.status(500).json({ success: false, message: 'Excel export failed', error: err.message });
//   }
// });

//budgetreport ends
