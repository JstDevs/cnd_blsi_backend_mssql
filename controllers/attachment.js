const { attachment } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, DataImage, DataName, DataType } = req.body;
    const item = await attachment.create({ LinkID, DataImage, DataName, DataType });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await attachment.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await attachment.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "attachment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, DataImage, DataName, DataType } = req.body;
    const [updated] = await attachment.update({ LinkID, DataImage, DataName, DataType }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await attachment.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "attachment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await attachment.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "attachment deleted" });
    else res.status(404).json({ message: "attachment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};