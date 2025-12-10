const TransactionTableModel = require('../config/database').TransactionTable;
const PurchaseItemsModel = require('../config/database').PurchaseItems;
const AttachmentModel = require('../config/database').Attachment;
const EmployeeModel = require('../config/database').employee;
const ChartOfAccountsModel = require('../config/database').ChartofAccounts;
const DepartmentModel = require('../config/database').department;
const generateLinkID = require("../utils/generateID")
const getLatestApprovalVersion = require('../utils/getLatestApprovalVersion');
const db = require('../config/database')
const { Op, fn, col } = require('sequelize');
const Department = require('../models/Department');

exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      InvoiceDate,
      InvoiceNumber,
      SAI_No,
      SAIDate,
      ObligationRequestNumber,
      ALOBSDate,
      ContraAccountID,
      Total,
      AmountReceived,
      ResponsibilityCenter,
      OfficeUnitProject,
      Remarks,
      Items = [],
    } = req.body;

    // generate linkID
    const LinkID = generateLinkID();

    // get approval version
    const approvalVersion = await getLatestApprovalVersion('Journal Entry Voucher');

    const newRecord = await TransactionTableModel.create({
      LinkID,
      Status: 'Requested',
      APAR: 'Purchase Request',
      DocumentTypeID: 28,
      RequestedBy: req.user.employeeID,
      InvoiceDate,
      InvoiceNumber,
      SAI_No,
      SAIDate,
      ObligationRequestNumber,
      ALOBSDate,
      ContraAccountID,
      Total,
      AmountReceived,
      ResponsibilityCenter,
      OfficeUnitProject,
      Remarks,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: new Date(),
      ApprovalProgress: 0,
      ApprovalVersion: approvalVersion,
    }, { transaction: t });

    // Insert Purchase Items
    for (const item of Items) {
      await PurchaseItemsModel.create({
        LinkID,
        Quantity: item.Quantity,
        Unit: item.Unit,
        ItemID: item.ItemID,
        Cost: item.Cost
      }, { transaction: t });
    }

    // Insert Attachments    
    if (req.files && req.files.length > 0) {
      const blobAttachments = req.files.map(file => ({
        LinkID,
        DataName: file.originalname,
        DataType: file.mimetype,
        DataImage: `${req.uploadPath}/${file.filename}`
      }));
      await AttachmentModel.bulkCreate(blobAttachments, { transaction: t });
    }
    await t.commit();


    // Fetch with includes and virtual/computed fields
    const transaction = await TransactionTableModel.findOne({
      where: { ID: newRecord.ID },
      attributes: {
        include: [
          [
            fn(
              'CONCAT',
              col('RequestedByEmployee.FirstName'),
              ' ',
              col('RequestedByEmployee.MiddleName'),
              ' ',
              col('RequestedByEmployee.LastName')
            ),
            'RequestedByName'
          ],
          [col('Department.Name'), 'DepartmentName'],
          [col('ContraAccount.Name'), 'ChartOfAccountsName']
        ]
      },
      include: [
        {
          model: PurchaseItemsModel,
          as: 'PurchaseItems',
          required: false
        },
        {
          model: AttachmentModel,
          as: 'Attachments',
          required: false
        },
        {
          model: EmployeeModel,
          as: 'RequestedByEmployee',
          attributes: [],
          required: false
        },
        {
          model: ChartOfAccountsModel,
          as: 'ContraAccount',
          attributes: [],
          required: false
        },
        {
          model: DepartmentModel,
          as: 'Department',
          attributes: [],
          required: false
        }
      ]
    });


    res.status(201).json(transaction);

  } catch (error) {
    console.error('Error creating purchase request:', error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      InvoiceDate,
      Items = [],
      Attachments = [],
    } = req.body;

    const ID = req.params.id;

    // 1. Find transaction by ID
    const existing = await TransactionTableModel.findByPk(ID);
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // 2. Status must be 'Rejected'
    if (existing.Status !== 'Rejected') {
      throw new Error('Only rejected transactions can be updated.');
    }

    const LinkID = existing.LinkID;

    // 3. Get latest approval version
    const approvalVersion = await getLatestApprovalVersion('Journal Entry Voucher');

    // 4. Update transaction
    await TransactionTableModel.update({
      Status: 'Requested',
      RequestedBy: req.user.employeeID,
      InvoiceDate,
      ApprovalProgress: 0,
      ApprovalVersion: approvalVersion,
      ModifyBy: req.user.id,
      ModifyDate: new Date(),
    }, {
      where: { ID },
      transaction: t
    });

    // 5. Delete old purchase items
    await PurchaseItemsModel.destroy({ where: { LinkID }, transaction: t });

    // 6. Insert updated purchase items
    for (const item of Items) {
      await PurchaseItemsModel.create({
        LinkID,
        Quantity: item.Quantity,
        Unit: item.Unit,
        ItemID: item.ItemID,
        Cost: item.Cost,
      }, { transaction: t });
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



    // 8. Fetch updated full data
    const fullData = await TransactionTableModel.findOne({
      where: { ID },
      include: [
        { model: PurchaseItemsModel, as: 'PurchaseItems' },
        { model: AttachmentModel, as: 'Attachments' },
        {
          model: EmployeeModel,
          as: 'RequestedByEmployee',
          attributes: ['ID']
        },
        {
          model: ChartOfAccountsModel,
          as: 'ContraAccount',
          attributes: ['ID'],
          required: false
        }
      ]
    });

    await t.commit();
    res.status(200).json({ message: 'Purchase request updated successfully.', data: fullData });

  } catch (error) {
    await t.rollback();
    console.error('Error updating purchase request:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const transactions = await TransactionTableModel.findAll({
      attributes: {
        include: [
          [
            fn(
              'CONCAT',
              col('RequestedByEmployee.FirstName'),
              ' ',
              col('RequestedByEmployee.MiddleName'),
              ' ',
              col('RequestedByEmployee.LastName')
            ),
            'RequestedByName'
          ],
          [col('Department.Name'), 'DepartmentName'],
          [col('ContraAccount.Name'), 'ChartOfAccountsName']
        ]
      },
      include: [
        {
          model: PurchaseItemsModel,
          as: 'PurchaseItems',
          required: false
        },
        {
          model: AttachmentModel,
          as: 'Attachments',
          required: false
        },
        {
          model: EmployeeModel,
          as: 'RequestedByEmployee',
          attributes: [],
          required: false,
        },
        {
          model: ChartOfAccountsModel,
          as: 'ContraAccount',
          attributes: [],
          required: false
        },
        {
          model: DepartmentModel,
          as: 'Department',
          attributes: [],
          required: false
        }
      ],
      where: {
        Active: 1,
        APAR: {
          [Op.like]: `%Purchase Request%`
        }
      },
      order: [['CreatedDate']]
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getById = async (req, res) => {
};


exports.delete = async (req, res) => {
  try {
    throw new Error('Delete operation is not implemented. Not present in the old code.');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};