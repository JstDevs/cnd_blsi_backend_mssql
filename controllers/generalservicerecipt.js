// Sequelize CRUD logic for handling transactions, items, and attachments

const { Sequelize, Op } = require('sequelize');
const db = require('../config/database');
const { sequelize, TransactionTable, MarriageRecord, Attachment, documentType, TransactionItems, ApprovalAudit } = require('../config/database');
const generateLinkID = require("../utils/generateID")
const getLatestApprovalVersion = require('../utils/getLatestApprovalVersion');

async function saveTransaction(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const docID = 6;
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
      InvoiceDate,
      CustomerID,
      CustomerName,
      PaymentMethodID,
      Total,
      AmountReceived,
      Remarks,
      AmountinWords,
      WithheldAmount,
      Vat_Total,
      Discounts,
      AmountDue,
      VATExcludedPrice,
      FundsID,
      CheckNumber,
      PayeeBank,
      MoneyOrder,
      MoneyOrderDate,
      Attachments = [],
    } = parsedFields;

    let {
      IsNew,
      LinkID,
      Items,
      CheckDate,
    } = parsedFields;

    // console.log('Items:', Items);
    // Items = Items ? JSON.parse(Items) : [];

    if ((IsNew == "true") || (IsNew === true) || (IsNew == '1') || (IsNew == 1)) {
      IsNew = true;
    }
    else if ((IsNew == "false") || (IsNew === false) || (IsNew == '0') || (IsNew == 0)) {
      IsNew = false;
    }
    else {
      throw new Error('Invalid value for IsNew. Expected true or false.');
    }

    if (IsNew) {
      LinkID = generateLinkID();
    }

    const latestApprovalVersion = await getLatestApprovalVersion('Service Invoice');

    // get invoice number as the current number of the document type + 1
    const documentTypeRecord = await documentType.findOne({
      where: {
        Active: true,
        ID: docID
      },
      attributes: ['CurrentNumber']
    });
    if (!documentTypeRecord || !documentTypeRecord.CurrentNumber) {
      throw new Error('Document type not found or inactive');
    }
    const invoiceNumber = Number(documentTypeRecord.CurrentNumber) + 1;

    if (IsNew) {
      await TransactionTable.create({
        LinkID,
        Status: 'Requested',
        APAR: 'Official Receipt',
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID,
        InvoiceDate,
        CustomerID,
        CustomerName,
        InvoiceNumber: invoiceNumber,
        BillingDueDate: InvoiceDate,
        BillingAddress: 'Angadanan Municipal Hall',
        PaymentMethodID,
        Total,
        AmountReceived,
        RemainingBalance: 0,
        PaymentType: 'Full',
        Remarks,
        Credit: Total,
        Debit: Total,
        AmountinWords,
        WithheldAmount,
        Vat_Total,
        Discounts,
        AmountDue,
        VATExcludedPrice,
        ApprovalProgress: 0,
        ApprovalVersion: latestApprovalVersion,
        FundsID,
        CreatedBy: req.user.id,
        CreatedDate: new Date(),
        Active: true,
        CheckNumber,
        PayeeBank,
        CheckDate: CheckDate || null,
        MoneyOrder,
        MoneyOrderDate: MoneyOrderDate || null,
      }, { transaction: t });


      await documentType.update(
        { CurrentNumber: invoiceNumber },
        { where: { ID: docID } }
      );
    } else {
      await TransactionTable.update({
        Status: 'Requested',
        APAR: 'Official Receipt',
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID,
        InvoiceDate,
        CustomerID,
        CustomerName,
        InvoiceNumber: invoiceNumber,
        BillingDueDate: InvoiceDate,
        BillingAddress: 'Angadanan Municipal Hall',
        PaymentMethodID,
        Total,
        AmountReceived,
        RemainingBalance: 0,
        PaymentType: 'Full',
        Remarks,
        Credit: Total,
        Debit: Total,
        AmountinWords,
        WithheldAmount,
        Vat_Total,
        Discounts,
        AmountDue,
        VATExcludedPrice,
        ApprovalProgress: 0,
        ApprovalVersion: latestApprovalVersion,
        FundsID,
        ModifyBy: req.user.id,
        ModifyDate: new Date(),
        CheckNumber,
        PayeeBank,
        CheckDate: CheckDate || null,
        MoneyOrder,
        MoneyOrderDate: MoneyOrderDate || null,
      }, { where: { LinkID: LinkID }, transaction: t });
    }

    await TransactionItems.destroy({
      where: { LinkID: LinkID },
      transaction: t
    });

    for (const row of Items) {
      const UniqueID = generateLinkID();
      await TransactionItems.create({
        UniqueID: UniqueID,
        LinkID,
        ItemID: row.ItemID,
        ChargeAccountID: row.ChargeAccountID,
        Quantity: parseFloat(row.Quantity),
        ItemUnitID: row.ItemUnitID,
        Price: parseFloat(row.Price),
        TAXCodeID: row.TAXCodeID,
        TaxName: row.TaxName,
        TaxRate: parseFloat(row.TaxRate),
        Sub_Total_Vat_Ex: parseFloat(row.Sub_Total_Vat_Ex),
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: new Date(),
        Credit: parseFloat(row.Credit),
        Debit: parseFloat(row.Debit),
        Vat_Total: parseFloat(row.Vat_Total),
        EWT: parseFloat(row.EWT),
        WithheldAmount: parseFloat(row.WithheldAmount),
        Sub_Total: parseFloat(row.Sub_Total),
        EWTRate: parseFloat(row.EWTRate),
        Discounts: parseFloat(row.Discounts),
        DiscountRate: parseFloat(row.DiscountRate),
        AmountDue: parseFloat(row.AmountDue),
        PriceVatExclusive: parseFloat(row.PriceVatExclusive),
        Remarks: row.Remarks,
        FPP: row.FPP,
        Discounted: parseFloat(row.Discounted),
        InvoiceNumber: invoiceNumber,
        NormalBalance: row.NormalBalance,
        Vatable: row.Vatable
      }, { transaction: t });
    }

    // Attachment handling
    const existingIDs = Attachments.filter(att => att.ID).map(att => att.ID);

    // Delete attachments removed from the list
    await Attachment.destroy({
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
      await Attachment.bulkCreate(newAttachments, { transaction: t });
    }

    await t.commit();

    res.status(201).json({ message: 'success' });

  } catch (err) {
    console.error('❌ Error creating:', err);
    await t.rollback(); // rollback transaction
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}


const getAll = async (req, res) => {
  try {
    const items = await TransactionTable.findAll({
      where: {
        Active: 1,
        APAR: 'Official Receipt'
      },
      include: [
        {
          model: TransactionItems,
          as: 'TransactionItemsAll',
          required: false,
        },
        {
          model: Attachment,
          as: 'Attachments',
          required: false,
        },
      ],
      order: [['CreatedDate', 'DESC']],
    });

    // const formattedItems = items.map((item) => {
    //   const json = item.toJSON();

    //   json.TransactionStatus = json.Transaction?.Status || null;
    //   delete json.Transaction;

    //   json.BudgetDepartmentName = json.BudgetDepartment?.Name || null;
    //   delete json.BudgetDepartment;

    //   return json;
    // });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const t = await db.sequelize.transaction();

  try {
    const trx = await TransactionTable.findOne({ where: { ID: transactionId }, transaction: t });

    if (!trx) {
      await t.rollback();
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update status to Void instead of soft delete
    await trx.update(
      { Status: 'Void' },
      { transaction: t }
    );

    // Log to ApprovalAudit
    await ApprovalAudit.create({
      LinkID: trx.LinkID,
      InvoiceLink: trx.LinkID,
      RejectionDate: new Date(),
      Remarks: 'Voided',
      CreatedBy: req.user.id,
      CreatedDate: new Date(),
      ApprovalVersion: trx.ApprovalVersion
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Success' });

  } catch (error) {
    await t.rollback();
    console.error('Error deleting transaction:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const getCurrentNumber = async (req, res) => {
  try {
    const record = await documentType.findOne({
      where: {
        ID: 6,
        Active: 1
      },
      attributes: ['CurrentNumber']
    });

    if (!record) {
      return res.status(404).json({ message: 'Document type not found or inactive' });
    }

    const incrementedValue = Number(record.CurrentNumber) + 1;

    res.status(200).json({ CurrentNumber: incrementedValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch current number' });
  }
};


module.exports = {
  saveTransaction,
  getAll,
  deleteTransaction,
  getCurrentNumber
};
