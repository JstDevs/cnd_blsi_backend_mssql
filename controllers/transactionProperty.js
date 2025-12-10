const { transactionProperty } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, Municipality, Owner, Location, LotAndBlock, T_D_No, Classification, LandPrice, ImprovementPrice, TotalAssessedValue, TaxDue, Installment_No, InstallmentPayment, RemainingBalance, FullPayment, Penalty, Total, RequestedBy, CreatedDate, CreatedBy, Block, Discount, Present, Lot } = req.body;
    const item = await transactionProperty.create({ LinkID, Municipality, Owner, Location, LotAndBlock, T_D_No, Classification, LandPrice, ImprovementPrice, TotalAssessedValue, TaxDue, Installment_No, InstallmentPayment, RemainingBalance, FullPayment, Penalty, Total, RequestedBy, CreatedDate, CreatedBy, Block, Discount, Present, Lot });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await transactionProperty.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await transactionProperty.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "transactionProperty not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, Municipality, Owner, Location, LotAndBlock, T_D_No, Classification, LandPrice, ImprovementPrice, TotalAssessedValue, TaxDue, Installment_No, InstallmentPayment, RemainingBalance, FullPayment, Penalty, Total, RequestedBy, CreatedDate, CreatedBy, Block, Discount, Present, Lot } = req.body;
    const [updated] = await transactionProperty.update({ LinkID, Municipality, Owner, Location, LotAndBlock, T_D_No, Classification, LandPrice, ImprovementPrice, TotalAssessedValue, TaxDue, Installment_No, InstallmentPayment, RemainingBalance, FullPayment, Penalty, Total, RequestedBy, CreatedDate, CreatedBy, Block, Discount, Present, Lot }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await transactionProperty.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "transactionProperty not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await transactionProperty.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "transactionProperty deleted" });
    else res.status(404).json({ message: "transactionProperty not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};