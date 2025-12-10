const { travelPayment } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, Amount, Type, BudgetID } = req.body;
    const item = await travelPayment.create({ LinkID, Amount, Type, BudgetID });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await travelPayment.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await travelPayment.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "travelPayment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, Amount, Type, BudgetID } = req.body;
    const [updated] = await travelPayment.update({ LinkID, Amount, Type, BudgetID }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await travelPayment.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "travelPayment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await travelPayment.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "travelPayment deleted" });
    else res.status(404).json({ message: "travelPayment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};