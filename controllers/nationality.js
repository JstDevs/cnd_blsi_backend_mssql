const { nationality } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await nationality.create({ Name, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Only return active nationalities
    const items = await nationality.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await nationality.findOne({ where: { id: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "nationality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await nationality.update({ Name, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await nationality.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "nationality not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SOFT DELETE: Sets Active = false instead of removing from database
exports.delete = async (req, res) => {
  try {
    const [updated] = await nationality.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: new Date() },
      { where: { id: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "nationality deactivated" });
    else res.status(404).json({ message: "nationality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};