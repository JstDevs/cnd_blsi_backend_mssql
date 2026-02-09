const db = require('../config/database')
const BudgetModel = require('../config/database').Budget;
const DocumentTypeModel = require('../config/database').documentType;
const TransactionTableModel = require('../config/database').TransactionTable;
const AttachmentModel = require('../config/database').Attachment;
const TransactionItemModel = require('../config/database').TransactionItems;
const FiscalYearModel = require('../config/database').FiscalYear;
const DepartmentModel = require('../config/database').department;
const SubDepartmentModel = require('../config/database').subDepartment;
const ChartOfAccountsModel = require('../config/database').ChartofAccounts;
const FundModel = require('../config/database').Funds;
const ProjectModel = require('../config/database').Project;
const ApprovalAuditModel = require('../config/database').ApprovalAudit;

const { Op } = require('sequelize');
const generateLinkID = require("../utils/generateID")
const getLatestApprovalVersion = require('../utils/getLatestApprovalVersion');

const updateFundBalances = async (fundID, amountDelta, userID, transaction) => {
  const fund = await FundModel.findByPk(fundID, { transaction });
  if (fund) {
    const currentBalance = parseFloat(fund.Balance || 0);
    const currentTotal = parseFloat(fund.Total || 0);

    const newBalance = currentBalance + amountDelta;
    const newTotal = currentTotal + amountDelta;

    await FundModel.update(
      {
        Balance: newBalance,
        Total: newTotal,
        ModifyBy: userID,
        ModifyDate: db.sequelize.fn('GETDATE')
      },
      { where: { ID: fundID }, transaction }
    );
    console.log(`[fundTransfer.updateFundBalances] Fund ${fundID} updated. New Balance: ${newBalance}`);
  } else {
    console.warn(`[fundTransfer.updateFundBalances] Fund ${fundID} not found.`);
  }
};

exports.save = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const parsedFields = {};

    // Reconstruct Attachments array from fields like Attachments[0].ID starts
    const attachments = [];
    for (const key in req.body) {
      const match = key.match(/^Attachments\[(\d+)]\.(\w+)$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!attachments[index]) attachments[index] = {};
        attachments[index][field] = req.body[key];
      }
    }
    parsedFields.Attachments = attachments;
    // Reconstruct Attachments array from fields like Attachments[0].ID ends

    for (const key in req.body) {
      try {
        parsedFields[key] = JSON.parse(req.body[key]);
      } catch {
        parsedFields[key] = req.body[key];
      }
    }

    const {
      Attachments = []
    } = parsedFields;

    const data = parsedFields;

    const userID = req.user.id;
    const amountStr = String(data.Transfer || 0).replace(/,/g, '');
    const transferAmount = parseFloat(amountStr);

    const LinkID = generateLinkID();

    const docTypeID = 26; // Fund Transfer
    const doc = await DocumentTypeModel.findByPk(docTypeID, { transaction: t });
    if (!doc) throw new Error(`Document type ID ${docTypeID} not found.`);

    const suffix = doc.Suffix ? `-${doc.Suffix}` : '';
    const invoiceText = `${doc.Prefix}-${String(doc.CurrentNumber).padStart(5, '0')}${suffix}`;
    let statusValue = '';
    const matrixExists = await db.ApprovalMatrix.findOne({
      where: {
        DocumentTypeID: 26,
        Active: 1,
      },
      transaction: t
    });

    statusValue = matrixExists ? 'Requested' : 'Posted';
    const approvalVersion = await getLatestApprovalVersion('Fund Transfer');

    // Insert Transaction Table Record
    await TransactionTableModel.create({
      LinkID,
      Status: statusValue,
      APAR: 'Fund Transfer',
      DocumentTypeID: docTypeID,
      RequestedBy: 1,
      InvoiceDate: db.sequelize.fn('GETDATE'),
      InvoiceNumber: invoiceText,
      Total: transferAmount,
      Active: true,
      Remarks: data.Remarks,
      CreatedBy: userID,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ApprovalProgress: statusValue === 'Posted' ? 100 : 0,
      FundsID: data.FundsID,
      TargetID: data.TargetID,
      ApprovalVersion: approvalVersion
    }, { transaction: t });

    // Update Document Number
    await DocumentTypeModel.update(
      { CurrentNumber: doc.CurrentNumber + 1 },
      { where: { ID: docTypeID }, transaction: t }
    );

    // --- UPDATE Fund Balances IF AUTO-POSTED ---
    if (statusValue === 'Posted') {
      const sourceFundID = data.FundsID;
      const targetFundID = data.TargetID;

      console.log('[fundTransfer.save] Auto-posting. Updating funds:', { sourceFundID, targetFundID, transferAmount });

      if (sourceFundID) {
        await updateFundBalances(sourceFundID, -transferAmount, userID, t);
      }
      if (targetFundID) {
        await updateFundBalances(targetFundID, transferAmount, userID, t);
      }
    }

    // Attachment handling
    const existingIDs = Attachments.filter(att => att.ID).map(att => att.ID);

    // Delete attachments removed from the list
    await AttachmentModel.destroy({
      where: {
        LinkID,
        ID: { [Op.notIn]: existingIDs }
      },
      transaction: t
    });

    // Add new files
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        LinkID,
        DataName: file.originalname,
        DataType: file.mimetype,
        DataImage: `${req.uploadPath}/${file.filename}`
      }));
      await AttachmentModel.bulkCreate(newAttachments, { transaction: t });
    }

    await t.commit();

    res.json({ message: 'success' });
  } catch (error) {
    await t.rollback();
    console.error('Fund Transfer Save Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.fundList = async (req, res) => {
  try {
    const fundList = await FundModel.findAll({ where: { Active: true } });
    res.json(fundList);
  } catch (error) {
    console.error('Error loading funds:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const fundTransfers = await TransactionTableModel.findAll({
      where: {
        Active: true,
        APAR: { [Op.like]: '%Fund Transfer%' }
      },
      include: [
        {
          model: FundModel,
          as: 'Funds',
          required: false
        },
        {
          model: FundModel,
          as: 'targetFunds',
          required: false
        },
        {
          model: AttachmentModel,
          as: 'Attachments',
          required: false
        }
      ],
      order: [['CreatedDate', 'DESC']]
    });

    res.json(fundTransfers);
  } catch (error) {
    console.error('Error loading fund transfers:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// SOFT DELETE: Sets Active = false instead of removing from database
exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id || req.body.ID || req.body.id;
    const userID = req.user?.id ?? 1;

    const transaction = await TransactionTableModel.findByPk(id, { transaction: t });
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({ message: "fund transfer not found" });
    }

    // --- REVERT Fund Balances IF POSTED ---
    if (transaction.Status === 'Posted') {
      const sourceFundID = transaction.FundsID;
      const targetFundID = transaction.TargetID;
      const transferAmount = parseFloat(transaction.Total || 0);

      if (sourceFundID) await updateFundBalances(sourceFundID, transferAmount, userID, t); // Increment back source
      if (targetFundID) await updateFundBalances(targetFundID, -transferAmount, userID, t); // Decrement back target
    }

    // --- VOID Transaction ---
    await transaction.update({
      Status: 'Void',
      Active: true,
      ModifyBy: userID,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, { transaction: t });

    // --- LOG TO AUDIT ---
    await ApprovalAuditModel.create({
      LinkID: generateLinkID(),
      InvoiceLink: transaction.LinkID,
      RejectionDate: db.sequelize.fn('GETDATE'),
      Remarks: "Transaction Voided by User",
      CreatedBy: userID,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ApprovalVersion: transaction.ApprovalVersion
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'success' });
  } catch (error) {
    if (t) await t.rollback();
    console.error('FundTransfer delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.rejectTransaction = async (req, res) => {
  const { ID: id, LinkID: linkId, Reason: reason } = req.body;

  const t = await db.sequelize.transaction();
  try {
    // --- 1. Update Transaction Table ---
    await TransactionTableModel.update(
      { Status: "Rejected" },
      { where: { ID: id }, transaction: t }
    );

    // --- 2. Insert into Approval Audit ---
    await ApprovalAuditModel.create(
      {
        LinkID: linkId,
        RejectionDate: db.sequelize.fn('GETDATE'),
        Remarks: reason,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE')
      },
      { transaction: t }
    );

    // --- 3. Commit ---
    await t.commit();
    res.json({ success: true, message: "Transaction rejected successfully." });
  } catch (err) {
    // --- Rollback on error ---
    if (t) await t.rollback();
    console.error('FundTransfer reject error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.approve = async (req, res) => {
  const { ID: id, LinkID: linkId, Remarks: remarks } = req.body;

  const t = await db.sequelize.transaction();
  try {
    // --- 1. Update Transaction Table to Posted ---
    await TransactionTableModel.update(
      { Status: 'Posted', ApprovalProgress: 100 },
      { where: { ID: id }, transaction: t }
    );

    // --- 2. Insert into Approval Audit ---
    await ApprovalAuditModel.create(
      {
        LinkID: linkId,
        ApprovalDate: db.sequelize.fn('GETDATE'),
        Remarks: remarks || null,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE')
      },
      { transaction: t }
    );

    // --- 3. Update Fund balances ---
    const transaction = await TransactionTableModel.findByPk(id, { transaction: t });
    if (!transaction) throw new Error(`Transaction ID ${id} not found.`);

    const sourceFundID = transaction.FundsID;
    const targetFundID = transaction.TargetID;
    const transferAmount = parseFloat(transaction.Total || 0);

    // Update source fund (deduct)
    if (sourceFundID) {
      await updateFundBalances(sourceFundID, -transferAmount, req.user.id, t);
    }

    // Update target fund (add)
    if (targetFundID) {
      await updateFundBalances(targetFundID, transferAmount, req.user.id, t);
    }

    // --- 4. Commit ---
    await t.commit();
    res.json({ success: true, message: 'Transaction approved successfully.' });
  } catch (err) {
    if (t) await t.rollback();
    console.error('FundTransfer approve error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
