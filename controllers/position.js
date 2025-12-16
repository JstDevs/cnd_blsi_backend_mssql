const { position } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await position.create({ Name, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Only return active positions
    const items = await position.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await position.findOne({ where: { id: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "position not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await position.update({ Name, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await position.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "position not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SOFT DELETE: Sets Active = false instead of removing from database
exports.delete = async (req, res) => {
  try {
    const [updated] = await position.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: new Date() },
      { where: { id: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "position deactivated" });
    else res.status(404).json({ message: "position not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};