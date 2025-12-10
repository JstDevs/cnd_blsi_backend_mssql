const { transactionItems } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, ItemID, ChargeAccountID, Quantity, ItemUnitID, Price, PriceVatExclusive, Sub_Total, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, TAXCodeID, UniqueID, Debit, Credit, Discounted, Sub_Total_Vat_Ex, BankID, SecondAccountID, TaxName, TaxRate, VoucherLink, InvoiceNumber, Remarks, EWT, WithheldAmount, Vat_Total, EWTRate, Discounts, DiscountRate, AmountDue, FPP, NormalBalance, ResponsibilityCenter, Vatable } = req.body;
    const item = await transactionItems.create({ LinkID, ItemID, ChargeAccountID, Quantity, ItemUnitID, Price, PriceVatExclusive, Sub_Total, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, TAXCodeID, UniqueID, Debit, Credit, Discounted, Sub_Total_Vat_Ex, BankID, SecondAccountID, TaxName, TaxRate, VoucherLink, InvoiceNumber, Remarks, EWT, WithheldAmount, Vat_Total, EWTRate, Discounts, DiscountRate, AmountDue, FPP, NormalBalance, ResponsibilityCenter, Vatable });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await transactionItems.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await transactionItems.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "transactionItems not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, ItemID, ChargeAccountID, Quantity, ItemUnitID, Price, PriceVatExclusive, Sub_Total, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, TAXCodeID, UniqueID, Debit, Credit, Discounted, Sub_Total_Vat_Ex, BankID, SecondAccountID, TaxName, TaxRate, VoucherLink, InvoiceNumber, Remarks, EWT, WithheldAmount, Vat_Total, EWTRate, Discounts, DiscountRate, AmountDue, FPP, NormalBalance, ResponsibilityCenter, Vatable } = req.body;
    const [updated] = await transactionItems.update({ LinkID, ItemID, ChargeAccountID, Quantity, ItemUnitID, Price, PriceVatExclusive, Sub_Total, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, TAXCodeID, UniqueID, Debit, Credit, Discounted, Sub_Total_Vat_Ex, BankID, SecondAccountID, TaxName, TaxRate, VoucherLink, InvoiceNumber, Remarks, EWT, WithheldAmount, Vat_Total, EWTRate, Discounts, DiscountRate, AmountDue, FPP, NormalBalance, ResponsibilityCenter, Vatable }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await transactionItems.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "transactionItems not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await transactionItems.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "transactionItems deleted" });
    else res.status(404).json({ message: "transactionItems not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};