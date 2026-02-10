// const {  } = require('../config/database');
const { sequelize, MarriageRecord, TransactionTable, Attachment, documentType, Customer, employee, ApprovalAudit } = require('../config/database');
const PaymentMethodModel = require('../config/database').paymentMethod;
const db = require('../config/database');
const generateLinkID = require("../utils/generateID")
const { getAllWithAssociations } = require("../models/associatedDependency");
const getLatestApprovalVersion = require('../utils/getLatestApprovalVersion');
const { Op, fn, col, literal } = require('sequelize');
const Position = require('../models/Position');

exports.saveTransaction = async (req, res) => {
  const t = await sequelize.transaction();
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
    else if ((data.IsNew == "false") || (data.IsNew === false) || (data.IsNew == '0') || (data.IsNew == 0)) {
      IsNew = false;
    }
    else {
      throw new Error('Invalid value for IsNew. Expected true or false.');
    }

    const docID = 19;
    let statusValue = '';
    const matrixExists = await db.ApprovalMatrix.findOne({
      where: {
        DocumentTypeID: docID,
        Active: 1,
      },
      transaction: t
    });

    statusValue = matrixExists ? 'Requested' : 'Posted';

    const refID = IsNew ? generateLinkID() : data.LinkID;
    const latestapprovalversion = await getLatestApprovalVersion('Marriage Receipt');

    // sanitized data
    data.CustomerID = data.CustomerID && data.CustomerID !== '' ? data.CustomerID : null;
    data.MarytoID = data.MarytoID && data.MarytoID !== '' ? data.MarytoID : null;
    data.Total = data.Total && data.Total !== '' ? parseFloat(data.Total) : 0;
    data.CustomerAge = data.CustomerAge && data.CustomerAge !== '' ? parseInt(data.CustomerAge) : 0;
    data.MarrytoAge = data.MarrytoAge && data.MarrytoAge !== '' ? parseInt(data.MarrytoAge) : 0;

    // ------------------ Create New Payor ------------------
    if (IsNew && !data.CustomerID && data.CustomerName) {
      try {
        console.log('Creating New Payor (Marriage):', data.CustomerName);
        const newCustomer = await Customer.create({
          Name: data.CustomerName,
          Active: true,
          CreatedBy: req.user.id,
          CreatedDate: db.sequelize.fn('GETDATE'),
          ModifyBy: req.user.id,
          ModifyDate: db.sequelize.fn('GETDATE')
        }, { transaction: t });
        data.CustomerID = newCustomer.ID;
      } catch (err) {
        console.error('Error creating payor:', err);
      }
    }


    // ---------------- Create New Spouse if needed ----------------
    if (IsNew && !data.MarytoID && data.MarrytoName) {
      try {
        console.log('Creating New Spouse:', data.MarrytoName);
        const newSpouse = await Customer.create({
          Name: data.MarrytoName,
          Active: true,
          CreatedBy: req.user.id,
          CreatedDate: db.sequelize.fn('GETDATE'),
          ModifyBy: req.user.id,
          ModifyDate: db.sequelize.fn('GETDATE')
        }, { transaction: t });
        data.MarytoID = newSpouse.ID; // Update the ID variable you use for creating the record
      } catch (err) {
        console.error('Error creating spouse:', err);
      }
    }

    if (IsNew) {
      // Create Transaction Table record
      await TransactionTable.create({
        LinkID: refID,
        APAR: 'Marriage Receipt',
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID,
        InvoiceDate: data.InvoiceDate,
        CustomerID: data.CustomerID,
        CustomerName: data.CustomerName,
        InvoiceNumber: data.InvoiceNumber,
        Total: data.Total,
        PaymentType: 'test',
        Remarks: data.Remarks,
        Status: statusValue,
        Active: 1,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE'),
        Credit: data.Total,
        Debit: data.Total,
        VATExcludedPrice: data.Total,
        EWT: 0,
        WithheldAmount: 0,
        Vat_Total: 0,
        AmountDue: data.Total,
        ApprovalProgress: 0,
        ApprovalVersion: latestapprovalversion,
        FundsID: 1
      }, { transaction: t });


      await documentType.increment(
        { CurrentNumber: 1 },
        {
          where: { ID: docID },
          transaction: t
        }
      );

      // Insert Marriage Record
      await MarriageRecord.create({
        LinkID: refID,
        CustomerID: data.CustomerID,
        CustomerAge: data.CustomerAge,
        MarytoID: data.MarytoID,
        MarrytoAge: data.MarrytoAge,
        Cenomar: data.Cenomar,
        RegisterNumber: data.RegisterNumber,
        CreatedBy: req.user.employeeID,
        CreatedDate: data.InvoiceDate,
      }, { transaction: t });

    } else {
      // Update Transaction Table
      await TransactionTable.update({
        APAR: 'Marriage Receipt',
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID,
        InvoiceDate: data.InvoiceDate,
        CustomerID: data.CustomerID,
        CustomerName: data.CustomerName,
        InvoiceNumber: data.InvoiceNumber,
        Total: data.Total,
        PaymentType: 'test',
        Remarks: data.Remarks,
        Status: statusValue,
        Active: 1,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE'),
        Credit: 0,
        Debit: data.Total,
        VATExcludedPrice: data.Total,
        EWT: 0,
        WithheldAmount: 0,
        Vat_Total: 0,
        AmountDue: data.Total,
        ApprovalProgress: 0,
        ApprovalVersion: latestapprovalversion
      }, {
        where: { LinkID: refID },
        transaction: t
      });

      await MarriageRecord.update({
        CustomerID: data.CustomerID,
        CustomerAge: data.CustomerAge,
        MarytoID: data.MarytoID,
        MarrytoAge: data.MarrytoAge,
        Cenomar: data.Cenomar,
        RegisterNumber: data.RegisterNumber,
        ModifyBy: req.user.employeeID,
        ModifyDate: data.InvoiceDate,
      }, {
        where: { LinkID: refID },
        transaction: t
      });
    }

    // Attachment handling
    const existingIDs = Attachments.filter(att => att.ID).map(att => att.ID);

    // Delete attachments removed from the list
    await Attachment.destroy({
      where: {
        LinkID: refID,
        ID: { [Op.notIn]: existingIDs }
      },
      transaction: t
    });

    // Add new files
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        LinkID: refID,
        DataName: file.originalname,
        DataType: file.mimetype,
        DataImage: `${req.uploadPath}/${file.filename}`
      }));
      await Attachment.bulkCreate(newAttachments, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'success' });
  } catch (error) {
    console.error('❌ Error in saveMarriageTransaction:', error);
    if (t) await t.rollback();
    res.status(500).json({ error: error.message });
  }
}

exports.getAll = async (req, res) => {
  try {
    const results = await TransactionTable.findAll({
      where: {
        Active: 1,
        APAR: {
          [Op.like]: '%Marriage Receipt%'
        }
      },
      attributes: {
        include: [
          [
            literal("ISNULL([RequestedByEmployee].[FirstName], '') + ' ' + ISNULL([RequestedByEmployee].[MiddleName], '') + ' ' + ISNULL([RequestedByEmployee].[LastName], '')"),
            'RequestedByName'
          ],
        ]
      },
      include: [
        {
          model: documentType,
          as: 'DocumentType',
          required: false
        },
        {
          model: Customer,
          as: 'Customer',
          required: false
        },
        {
          model: employee,
          as: 'RequestedByEmployee',
          required: false,
        }
      ],
      order: [['CreatedDate', 'DESC']],
    });

    res.json(results);
  } catch (err) {
    console.error('❌ Error in getAll marriage records:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const item = await MarriageRecord.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "MarriageRecord not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const transactionId = req.params.id;
  const t = await sequelize.transaction();
  try {
    const trx = await TransactionTable.findOne({ where: { ID: transactionId }, transaction: t });

    if (!trx) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Update status to Void
    await trx.update({ Status: 'Void' }, { transaction: t });

    // Log the void action
    await ApprovalAudit.create({
      LinkID: trx.LinkID,
      InvoiceLink: trx.LinkID,
      PositionorEmployee: "Employee",
      PositionorEmployeeID: req.user.employeeID,
      SequenceOrder: trx.ApprovalProgress || 0,
      ApprovalOrder: 0,
      Remarks: "Voided",
      RejectionDate: db.sequelize.fn('GETDATE'),
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ApprovalVersion: trx.ApprovalVersion || "1"
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Marriage record voided successfully', ID: transactionId, Status: 'Void' });

  } catch (error) {
    if (t) await t.rollback();
    console.error('❌ Error in delete marriage record:', error);
    return res.status(500).json({ error: error.message || 'Server error.' });
  }
};

const validateApproval = require('../utils/validateApproval');

exports.approve = async (req, res) => {
  const { ID } = req.body;
  const t = await sequelize.transaction();
  try {
    const trx = await TransactionTable.findOne({ where: { ID }, transaction: t });

    if (!trx) {
      await t.rollback();
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    if (trx.Status === 'Void') {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot approve a voided transaction' });
    }

    if (trx.Status === 'Approved' || trx.Status === 'Posted') {
      await t.rollback();
      return res.status(400).json({ error: 'Transaction is already approved' });
    }

    // --- Validate Approval Logic ---
    const userForValidation = {
      employeeID: req.user.employeeID,
      userAccessIDs: req.user.userAccessIDs || []
    };

    const validationResult = await validateApproval({
      documentTypeID: 19, // Marriage Receipt Document ID
      approvalVersion: trx.ApprovalVersion,
      totalAmount: trx.Total || 0,
      transactionLinkID: trx.LinkID,
      user: userForValidation
    });

    if (!validationResult.canApprove) {
      await t.rollback();
      return res.status(400).json({ error: validationResult.error });
    }

    // Update Transaction
    await trx.update({
      Status: validationResult.nextStatus,
      ApprovalProgress: validationResult.nextSequence,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, { transaction: t });

    // Log Approval
    await ApprovalAudit.create({
      LinkID: trx.LinkID,
      InvoiceLink: trx.LinkID,
      PositionorEmployee: "Employee",
      PositionorEmployeeID: req.user.employeeID,
      SequenceOrder: validationResult.currentSequence,
      ApprovalOrder: 0,
      ApprovalDate: db.sequelize.fn('GETDATE'),
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ApprovalVersion: trx.ApprovalVersion
    }, { transaction: t });

    await t.commit();

    const message = validationResult.nextStatus === 'Posted'
      ? 'Marriage Receipt approved and POSTED successfully.'
      : 'Marriage Receipt approved (Partial). Waiting for next level.';

    res.json({ success: true, message });

  } catch (error) {
    console.error('❌ Error in marriage approve:', error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.reject = async (req, res) => {
  const { ID, reason } = req.body; // Ensure reason is desctructured if sent
  const t = await sequelize.transaction();
  try {
    const trx = await TransactionTable.findOne({ where: { ID }, transaction: t });

    if (!trx) {
      await t.rollback();
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    if (trx.Status === 'Void') {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot reject a voided transaction' });
    }

    if (trx.Status === 'Rejected') {
      await t.rollback();
      return res.status(400).json({ error: 'Transaction is already rejected' });
    }

    await trx.update({
      Status: 'Rejected',
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, { transaction: t });

    await ApprovalAudit.create({
      LinkID: trx.LinkID,
      InvoiceLink: trx.LinkID,
      PositionorEmployee: "Employee",
      PositionorEmployeeID: req.user.employeeID,
      SequenceOrder: trx.ApprovalProgress || 0,
      ApprovalOrder: 0,
      RejectionDate: db.sequelize.fn('GETDATE'), // Use RejectionDate
      Remarks: reason || 'Rejected',
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ApprovalVersion: trx.ApprovalVersion
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Transaction rejected successfully.' });

  } catch (error) {
    console.error('❌ Error in marriage reject:', error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};
