const db=require('../config/database')
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
    const transferAmount = parseFloat(data.Transfer);

    const LinkID = generateLinkID();

    const docTypeID = 26; // Fund Transfer
    const doc = await DocumentTypeModel.findByPk(docTypeID, { transaction: t });
    if (!doc) throw new Error(`Document type ID ${docTypeID} not found.`);

    const invoiceText = `${doc.Prefix}-${doc.CurrentNumber}-${doc.Suffix}`;
    const approvalVersion = await getLatestApprovalVersion('Fund Transfer');

    // Insert Transaction Table Record
    await TransactionTableModel.create({
      LinkID,
      Status: 'Requested',
      APAR: 'Fund Transfer',
      DocumentTypeID: docTypeID,
      RequestedBy: 1,
      InvoiceDate: new Date(),
      InvoiceNumber: invoiceText,
      Total: transferAmount,
      Active: true,
      Remarks: data.Remarks,
      CreatedBy: userID,
      CreatedDate: new Date(),
      ApprovalProgress: 0,
      FundsID: data.FundsID,
      TargetID: data.TargetID,
      ApprovalVersion: approvalVersion
    }, { transaction: t });

    // Update Document Number
    await DocumentTypeModel.update(
      { CurrentNumber: doc.CurrentNumber + 1 },
      { where: { ID: docTypeID }, transaction: t }
    );

    
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
    const fundList = await FundModel.findAll();
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
    });

    res.json(fundTransfers);
  } catch (error) {
    console.error('Error loading fund transfers:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  res.json({ message: 'Deleted logic not implemented, same in old software' });
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
        RejectionDate: new Date(),
        Remarks: reason,
        CreatedBy: req.user.id,
        CreatedDate: new Date()
      },
      { transaction: t }
    );

    // --- 3. Commit ---
    await t.commit();
    res.json({ success: true, message: "Transaction rejected successfully." });
  } catch (err) {
    // --- Rollback on error ---
    await t.rollback();
    res.status(500).json({ success: false, error: err.message });
  }
};
