const { purchaseItems } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, Quantity, Unit, ItemID, Cost } = req.body;
    const item = await purchaseItems.create({ LinkID, Quantity, Unit, ItemID, Cost });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await purchaseItems.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await purchaseItems.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "purchaseItems not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, Quantity, Unit, ItemID, Cost } = req.body;
    const [updated] = await purchaseItems.update({ LinkID, Quantity, Unit, ItemID, Cost }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await purchaseItems.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "purchaseItems not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await purchaseItems.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "purchaseItems deleted" });
    else res.status(404).json({ message: "purchaseItems not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};