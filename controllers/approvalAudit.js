const { ApprovalAudit } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, InvoiceLink, PositionorEmployee, PositionorEmployeeID, SequenceOrder, ApprovalOrder, ApprovalDate, RejectionDate, Remarks, CreatedBy, CreatedDate, ApprovalVersion } = req.body;
    const item = await ApprovalAudit.create({ LinkID, InvoiceLink, PositionorEmployee, PositionorEmployeeID, SequenceOrder, ApprovalOrder, ApprovalDate, RejectionDate, Remarks, CreatedBy, CreatedDate, ApprovalVersion });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await ApprovalAudit.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ApprovalAudit.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "ApprovalAudit not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, InvoiceLink, PositionorEmployee, PositionorEmployeeID, SequenceOrder, ApprovalOrder, ApprovalDate, RejectionDate, Remarks, CreatedBy, CreatedDate, ApprovalVersion } = req.body;
    const [updated] = await ApprovalAudit.update({ LinkID, InvoiceLink, PositionorEmployee, PositionorEmployeeID, SequenceOrder, ApprovalOrder, ApprovalDate, RejectionDate, Remarks, CreatedBy, CreatedDate, ApprovalVersion }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await ApprovalAudit.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "ApprovalAudit not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ApprovalAudit.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "ApprovalAudit deleted" });
    else res.status(404).json({ message: "ApprovalAudit not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};