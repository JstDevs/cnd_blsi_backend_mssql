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
const validateApproval = require('../utils/validateApproval');

const updateBudgetBalances = async (budgetID, amountDelta, userID, transaction) => {
  const budget = await BudgetModel.findByPk(budgetID, { transaction });
  if (budget) {
    const currentTransfer = parseFloat(budget.Transfer || 0);
    const newTransfer = currentTransfer + amountDelta;

    const appropriation = parseFloat(budget.Appropriation || 0);
    const supplemental = parseFloat(budget.Supplemental || 0);
    const released = parseFloat(budget.Released || 0);

    // Correct Formula:
    // AppropriationBalance = (Appropriation + Supplemental + newTransfer) - Released
    // AllotmentBalance = Released - Charges (We don't change this here as it's not affected by transfers)
    const newAppropriationBalance = (appropriation + supplemental + newTransfer) - released;

    await budget.update({
      Transfer: newTransfer,
      AppropriationBalance: newAppropriationBalance,
      ModifyBy: userID,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, { transaction });
    console.log(`[budgetTransfer.updateBudgetBalances] Budget ${budgetID} updated. New Transfer: ${newTransfer}, New Appr. Balance: ${newAppropriationBalance}`);
  } else {
    console.warn(`[budgetTransfer.updateBudgetBalances] Budget ${budgetID} not found.`);
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
      Attachments = [],
    } = parsedFields;

    const data = parsedFields;

    let IsNew = '';
    if ((data.IsNew == "true") || (data.IsNew === true) || (data.IsNew == '1') || (data.IsNew == 1)) {
      IsNew = true;
    }
    else if ((data.IsNew == "false") || (data.IsNew === false) || (data.IsNew == '0') || (data.IsNew == 1)) {
      IsNew = false;
    }
    else {
      throw new Error('Invalid value for IsNew. Expected true or false.');
    }

    const userID = req.user.id;

    const amountStr = String(data.Transfer || 0).replace(/,/g, '');
    const amount = parseFloat(amountStr);
    console.log('[budgetTransfer.save] data.Transfer:', data.Transfer, 'parsed amount:', amount);

    const LinkID = IsNew ? generateLinkID() : data.LinkID;

    const docTypeID = 22; // Budget Transfer
    const doc = await DocumentTypeModel.findByPk(docTypeID, { transaction: t });
    if (!doc) throw new Error(`Document type ID ${docTypeID} not found.`);

    const invoiceText = IsNew ? `${doc.Prefix}-${String(doc.CurrentNumber).padStart(5, '0')}-${doc.Suffix}` : data.InvoiceNumber;
    let statusValue = '';
    const matrixExists = await db.ApprovalMatrix.findOne({
      where: {
        DocumentTypeID: 22,
        Active: 1,
      },
      transaction: t
    });

    statusValue = matrixExists ? 'Requested' : 'Posted';
    const approvalVersion = await getLatestApprovalVersion('Budget Transfer');

    if (IsNew) {
      await TransactionTableModel.create({
        LinkID,
        Status: statusValue,
        APAR: 'Budget Transfer',
        DocumentTypeID: docTypeID,
        RequestedBy: userID,
        InvoiceDate: db.sequelize.fn('GETDATE'),
        InvoiceNumber: invoiceText,
        Total: amount,
        Active: true,
        Remarks: data.Remarks,
        CreatedBy: userID,
        CreatedDate: db.sequelize.fn('GETDATE'),
        ApprovalProgress: statusValue === 'Posted' ? 100 : 0,
        BudgetID: data.BudgetID,
        TargetID: data.TargetID,
        ApprovalVersion: approvalVersion
      }, { transaction: t });

      await DocumentTypeModel.update(
        { CurrentNumber: doc.CurrentNumber + 1 },
        { where: { ID: docTypeID }, transaction: t }
      );
    } else {
      await TransactionTableModel.update({
        ModifyBy: userID,
        ModifyDate: db.sequelize.fn('GETDATE'),
        Total: amount,
        Remarks: data.Remarks,
        BudgetID: data.BudgetID,
        TargetID: data.TargetID,
        ApprovalProgress: statusValue === 'Posted' ? 100 : 0,
        Status: statusValue
      }, {
        where: { LinkID },
        transaction: t
      });
    }

    // --- UPDATE Budget Tables IF AUTO-POSTED (New or Update) ---
    if (statusValue === 'Posted') {
      const sourceBudgetID = data.BudgetID;
      const targetBudgetID = data.TargetID;

      console.log('[budgetTransfer.save] Auto-posting. Updating budgets:', { sourceBudgetID, targetBudgetID, amount });

      if (sourceBudgetID) await updateBudgetBalances(sourceBudgetID, -amount, userID, t);
      if (targetBudgetID) await updateBudgetBalances(targetBudgetID, amount, userID, t);
    }


    // Delete removed attachments (if applicable)
    const existingIDs = Attachments.filter(att => att.ID).map(att => att.ID);
    if (!IsNew && existingIDs.length > 0) {
      await AttachmentModel.destroy({
        where: {
          LinkID: LinkID,
          ID: { [Op.notIn]: existingIDs }
        },
        transaction: t
      });
    }

    // Add new attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        LinkID: LinkID,
        DataName: file.originalname,
        DataType: file.mimetype,
        DataImage: `${req.uploadPath}/${file.filename}`
      }));

      await AttachmentModel.bulkCreate(newAttachments, { transaction: t });
    }

    await t.commit();

    // Optionally: Logging/Auditing here (not shown)

    res.json({ message: 'success' });
  } catch (error) {
    await t.rollback();
    console.error('BudgetTransfer save error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.budgetList = async (req, res) => {
  try {
    const userDepartmentID = req.user.departmentID;
    const allowedAccessDepartments = [1, 2, 3, 4];

    const whereCondition = {
      Active: true,
      // ...(allowedAccessDepartments.includes(userDepartmentID)
      //   ? {}
      //   : { DepartmentID: userDepartmentID })
    };

    const records = await BudgetModel.findAll({
      where: whereCondition,
      include: [
        {
          model: FiscalYearModel,
          as: 'FiscalYear',
          required: false,
        },
        {
          model: DepartmentModel,
          as: 'Department',
          required: false,
        },
        {
          model: SubDepartmentModel,
          as: 'SubDepartment',
          required: false,
        },
        {
          model: ChartOfAccountsModel,
          as: 'ChartofAccounts',
          required: false,
        },
        {
          model: FundModel,
          as: 'Funds',
          required: false,
        },
        {
          model: ProjectModel,
          as: 'Project',
          required: false,
        }
      ],
      order: [['TotalAmount', 'ASC']]
    });

    res.json(records);
  } catch (error) {
    console.error('Error loading budget grid:', error);
    res.status(500).json({ error: error.message || 'Failed to load budget data' });
  }
};

exports.list = async (req, res) => {
  try {
    const records = await TransactionTableModel.findAll({
      where: {
        Active: true,
        APAR: {
          [Op.like]: '%Budget Transfer%'
        }
      },
      include: [
        {
          model: BudgetModel,
          as: 'Budget',
          required: false,
        },
        {
          model: AttachmentModel,
          as: 'Attachments',
          required: false,
        }
      ],
      order: [['CreatedDate', 'DESC']]
    });

    res.json(records);
  } catch (error) {
    console.error('Error loading Budget Transfer list:', error);
    res.status(500).json({ error: 'Failed to load Budget Transfer records' });
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
      return res.status(404).json({ message: "budget transfer not found" });
    }

    // --- REVERT Budget Tables IF POSTED ---
    if (transaction.Status === 'Posted') {
      const sourceBudgetID = transaction.BudgetID;
      const targetBudgetID = transaction.TargetID;
      const transferAmount = parseFloat(transaction.Total || 0);

      if (sourceBudgetID) await updateBudgetBalances(sourceBudgetID, transferAmount, userID, t); // Increment back source
      if (targetBudgetID) await updateBudgetBalances(targetBudgetID, -transferAmount, userID, t); // Decrement back target
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
    console.error('BudgetTransfer delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Recover soft-deleted transfer transaction
exports.recover = async (req, res) => {
  try {
    const id = req.params.id || req.body.ID || req.body.id;
    console.log('[budgetTransfer.recover] called, params.id=', req.params.id, 'body=', req.body);
    const userID = req.user?.id ?? 1;

    const [updated] = await TransactionTableModel.update(
      {
        Active: true,
        ModifyBy: userID,
        ModifyDate: db.sequelize.fn('GETDATE'),
      },
      {
        where: { ID: id }
      }
    );

    if (updated) {
      res.json({ message: 'success' });
    } else {
      res.status(404).json({ message: 'not found or already active' });
    }
  } catch (err) {
    console.error('BudgetTransfer recover error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.approveTransaction = async (req, res) => {
  const { id, ID } = req.body;
  const txnId = ID || id;

  if (!txnId) return res.status(400).json({ success: false, error: 'Missing required field: id' });

  const t = await db.sequelize.transaction();
  try {
    const transaction = await TransactionTableModel.findByPk(txnId, { transaction: t });
    if (!transaction) throw new Error("Transaction not found");

    if (transaction.Status === 'Posted') {
      await t.rollback();
      return res.json({ success: true, message: "Transaction already posted." });
    }

    // 🔹 1. Validate Approval Matrix
    const validation = await validateApproval({
      documentTypeID: transaction.DocumentTypeID || 22, // 22 is Budget Transfer
      approvalVersion: transaction.ApprovalVersion,
      totalAmount: parseFloat(transaction.Total || 0),
      transactionLinkID: transaction.LinkID,
      user: req.user
    });

    if (!validation.canApprove) {
      await t.rollback();
      return res.status(403).json({ success: false, error: validation.error });
    }

    const isFinal = validation.isFinal;

    // 🔹 2. Update Transaction Table
    const updatePayload = {
      ApprovalProgress: validation.nextSequence || transaction.ApprovalProgress,
      Status: validation.nextStatus
    };

    await transaction.update(updatePayload, { transaction: t });

    // 🔹 3. Insert into Approval Audit
    await ApprovalAuditModel.create(
      {
        LinkID: generateLinkID(),
        InvoiceLink: transaction.LinkID,
        PositionorEmployee: "Employee",
        PositionorEmployeeID: req.user.employeeID,
        SequenceOrder: validation.currentSequence,
        ApprovalOrder: validation.numberOfApprovers,
        ApprovalDate: db.sequelize.fn('GETDATE'),
        RejectionDate: null,
        Remarks: null,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE'),
        ApprovalVersion: transaction.ApprovalVersion
      },
      { transaction: t }
    );

    // --- UPDATE Budget Table ONLY IF FINAL APPROVAL ---
    if (isFinal) {
      // Update Budget table: handle transfer between budgets
      const sourceBudgetID = transaction.BudgetID;
      const targetBudgetID = transaction.TargetID;
      const transferAmount = parseFloat(transaction.Total || 0);

      console.log('[budgetTransfer.approveTransaction] Final approval reached. Updating budgets:', { sourceBudgetID, targetBudgetID, transferAmount });

      // Update source budget (deduct)
      if (sourceBudgetID) {
        await updateBudgetBalances(sourceBudgetID, -transferAmount, req.user.id, t);
      }

      // Update target budget (add)
      if (targetBudgetID) {
        await updateBudgetBalances(targetBudgetID, transferAmount, req.user.id, t);
      }
    }

    await t.commit();
    res.json({ success: true, message: 'Data saved successfully.' });
  } catch (err) {
    if (t) await t.rollback();
    console.error('[budgetTransfer.approveTransaction] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.rejectTransaction = async (req, res) => {
  const { ID: id, LinkID: linkId, Reason: reason } = req.body;

  const t = await db.sequelize.transaction();
  try {
    // --- UPDATE Transaction Table ---
    await TransactionTableModel.update(
      { Status: "Rejected" }, // maps to [Transaction Table].Status
      { where: { ID: id }, transaction: t }
    );

    // --- INSERT INTO Approval Audit ---
    await ApprovalAuditModel.create(
      {
        LinkID: linkId,            // [Link ID]
        RejectionDate: db.sequelize.fn('GETDATE'), // GETDATE()
        Remarks: reason,           // rejection reason
        CreatedBy: req.user.id,      // maps to strUser
        CreatedDate: db.sequelize.fn('GETDATE'),   // GETDATE()
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ success: true, message: "Transaction rejected successfully." });
  } catch (err) {
    await t.rollback();
    console.error('BudgetTransfer reject error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
