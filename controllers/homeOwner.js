const { homeOwner } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { CustomerID, PropertyCount } = req.body;
    const item = await homeOwner.create({ CustomerID, PropertyCount });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await homeOwner.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await homeOwner.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "homeOwner not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { CustomerID, PropertyCount } = req.body;
    const [updated] = await homeOwner.update({ CustomerID, PropertyCount }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await homeOwner.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "homeOwner not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await homeOwner.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "homeOwner deleted" });
    else res.status(404).json({ message: "homeOwner not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};