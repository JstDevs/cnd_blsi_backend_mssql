const { fields } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { id, LinkID, FieldNumber, Active, Description, DataType } = req.body;
    const item = await fields.create({ id, LinkID, FieldNumber, Active, Description, DataType });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await fields.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await fields.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "fields not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, LinkID, FieldNumber, Active, Description, DataType } = req.body;
    const [updated] = await fields.update({ id, LinkID, FieldNumber, Active, Description, DataType }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await fields.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "fields not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await fields.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "fields deleted" });
    else res.status(404).json({ message: "fields not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};