const { approvers } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, ApprovalVersion, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo } = req.body;
    const item = await approvers.create({ LinkID, ApprovalVersion, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await approvers.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await approvers.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "approvers not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, ApprovalVersion, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo } = req.body;
    const [updated] = await approvers.update({ LinkID, ApprovalVersion, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await approvers.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "approvers not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await approvers.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "approvers deleted" });
    else res.status(404).json({ message: "approvers not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};