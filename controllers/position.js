const db = require('../config/database');
const position = db.position;

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await position.create({
      Name,
      Active: true,
      CreatedBy: req.user ? req.user.id : '1',
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    });
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
    // Note: Model uses ID (uppercase)
    const item = await position.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "position not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    // Note: Model uses ID (uppercase)
    const [updated] = await position.update({
      Name,
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
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
      {
        Active: false,
        ModifyBy: req.user ? req.user.id : '1',
        ModifyDate: db.sequelize.fn('GETDATE')
      },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "position deactivated" });
    else res.status(404).json({ message: "position not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};