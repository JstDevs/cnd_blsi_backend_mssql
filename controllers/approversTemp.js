const { approversTemp } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo, ApprovalVersion } = req.body;
    const item = await approversTemp.create({ LinkID, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo, ApprovalVersion });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await approversTemp.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await approversTemp.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "approversTemp not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo, ApprovalVersion } = req.body;
    const [updated] = await approversTemp.update({ LinkID, PositionorEmployee, PositionorEmployeeID, AmountFrom, AmountTo, ApprovalVersion }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await approversTemp.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "approversTemp not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await approversTemp.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "approversTemp deleted" });
    else res.status(404).json({ message: "approversTemp not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};