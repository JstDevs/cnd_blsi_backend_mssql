// Sequelize CRUD logic for handling transactions, items, and attachments

const { Sequelize, Op } = require('sequelize');
const db = require('../config/database');
const { sequelize, TransactionTable, MarriageRecord, Attachment, documentType, TransactionItems, ApprovalAudit, Customer, vendor } = require('../config/database');
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

    let {
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

    const { PayorType } = parsedFields;

    // Sanitize numeric and ID fields
    CustomerID = CustomerID && CustomerID !== '' ? CustomerID : null;
    FundsID = FundsID && FundsID !== '' ? FundsID : null;
    PaymentMethodID = PaymentMethodID && PaymentMethodID !== '' ? PaymentMethodID : null;
    Total = Total && Total !== '' ? parseFloat(Total) : 0;
    AmountReceived = AmountReceived && AmountReceived !== '' ? parseFloat(AmountReceived) : 0;
    WithheldAmount = WithheldAmount && WithheldAmount !== '' ? parseFloat(WithheldAmount) : 0;
    Vat_Total = Vat_Total && Vat_Total !== '' ? parseFloat(Vat_Total) : 0;
    Discounts = Discounts && Discounts !== '' ? parseFloat(Discounts) : 0;
    AmountDue = AmountDue && AmountDue !== '' ? parseFloat(AmountDue) : 0;
    VATExcludedPrice = VATExcludedPrice && VATExcludedPrice !== '' ? parseFloat(VATExcludedPrice) : 0;

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

    // --------------- HANDLE NEW CUSTOMER / VENDOR CREATION ----------------
    if (IsNew && !CustomerID && CustomerName) {
      try {
        if (PayorType === 'Corporation') {
          console.log('Creating New Vendor for Receipt:', CustomerName);
          const newVendor = await vendor.create({
            Name: CustomerName,
            Active: true,
            CreatedBy: req.user.id,
            CreatedDate: db.sequelize.fn('GETDATE'),
            ModifyBy: req.user.id,
            ModifyDate: db.sequelize.fn('GETDATE')
          }, { transaction: t });
          CustomerID = newVendor.ID;
        } else {
          console.log('Creating New Individual Customer for Receipt:', CustomerName);
          // Default to Individual/Customer
          const newCustomer = await Customer.create({
            Name: CustomerName, // Often mapped to FirstName/LastName but logic here implies simplified Name field usage or Name as full string
            Active: true,
            CreatedBy: req.user.id,
            CreatedDate: db.sequelize.fn('GETDATE'),
            ModifyBy: req.user.id,
            ModifyDate: db.sequelize.fn('GETDATE')
          }, { transaction: t });
          CustomerID = newCustomer.ID;
        }
      } catch (creationErr) {
        console.error('Error creating new customer/vendor during receipt save:', creationErr);
        // Optional: throw or proceed with null ID (which matches original behavior) 
        // throw creationErr; 
      }
    }
    // ----------------------------------------------------------------------

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
    let statusValue = '';
    const matrixExists = await db.ApprovalMatrix.findOne({
      where: {
        DocumentTypeID: docID,
        Active: 1,
      },
      transaction: t
    });

    statusValue = matrixExists ? 'Requested' : 'Posted';

    if (IsNew) {
      await TransactionTable.create({
        LinkID,
        Status: statusValue,
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
        CreatedDate: db.sequelize.fn('GETDATE'),
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
        Status: statusValue,
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
        ModifyDate: db.sequelize.fn('GETDATE'),
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
        ItemID: row.ItemID && row.ItemID !== '' ? row.ItemID : null,
        ChargeAccountID: row.ChargeAccountID && row.ChargeAccountID !== '' ? row.ChargeAccountID : null,
        Quantity: parseFloat(row.Quantity) || 0,
        ItemUnitID: row.ItemUnitID && row.ItemUnitID !== '' ? row.ItemUnitID : null,
        Price: parseFloat(row.Price) || 0,
        TAXCodeID: row.TAXCodeID && row.TAXCodeID !== '' ? row.TAXCodeID : null,
        TaxName: row.TaxName,
        TaxRate: parseFloat(row.TaxRate) || 0,
        Sub_Total_Vat_Ex: parseFloat(row.Sub_Total_Vat_Ex) || 0,
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE'),
        Credit: parseFloat(row.Credit) || 0,
        Debit: parseFloat(row.Debit) || 0,
        Vat_Total: parseFloat(row.Vat_Total) || 0,
        EWT: parseFloat(row.EWT) || 0,
        WithheldAmount: parseFloat(row.WithheldAmount) || 0,
        Sub_Total: parseFloat(row.Sub_Total) || 0,
        EWTRate: parseFloat(row.EWTRate) || 0,
        Discounts: parseFloat(row.Discounts) || 0,
        DiscountRate: parseFloat(row.DiscountRate) || 0,
        AmountDue: parseFloat(row.AmountDue) || 0,
        PriceVatExclusive: parseFloat(row.PriceVatExclusive) || 0,
        Remarks: row.Remarks,
        FPP: row.FPP,
        Discounted: parseFloat(row.Discounted) || 0,
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
    console.error('Official Receipt getAll error:', err);
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
      RejectionDate: db.sequelize.fn('GETDATE'),
      Remarks: 'Voided',
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
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
    console.error('❌ Error getting current number:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch current number' });
  }
};


module.exports = {
  saveTransaction,
  getAll,
  deleteTransaction,
  getCurrentNumber
};
