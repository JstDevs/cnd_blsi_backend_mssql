const { apar } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, APAR, RequestedBy, RequestedDate, BudgetID, VendorID, CustomerID, ReferenceNumber, PONumber, DRNumber, BillingDate, BillingDueDate, Total, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, PaymentMethodID, PaymentTermsID, BillingNumber, Status, DocumentTypeID, uniqueID, InvoiceDate } = req.body;
    const item = await apar.create({ LinkID, APAR, RequestedBy, RequestedDate, BudgetID, VendorID, CustomerID, ReferenceNumber, PONumber, DRNumber, BillingDate, BillingDueDate, Total, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, PaymentMethodID, PaymentTermsID, BillingNumber, Status, DocumentTypeID, uniqueID, InvoiceDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await apar.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await apar.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "apar not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, APAR, RequestedBy, RequestedDate, BudgetID, VendorID, CustomerID, ReferenceNumber, PONumber, DRNumber, BillingDate, BillingDueDate, Total, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, PaymentMethodID, PaymentTermsID, BillingNumber, Status, DocumentTypeID, uniqueID, InvoiceDate } = req.body;
    const [updated] = await apar.update({ LinkID, APAR, RequestedBy, RequestedDate, BudgetID, VendorID, CustomerID, ReferenceNumber, PONumber, DRNumber, BillingDate, BillingDueDate, Total, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, PaymentMethodID, PaymentTermsID, BillingNumber, Status, DocumentTypeID, uniqueID, InvoiceDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await apar.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "apar not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await apar.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "apar deleted" });
    else res.status(404).json({ message: "apar not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};