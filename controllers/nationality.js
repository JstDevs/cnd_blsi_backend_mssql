const db = require('../config/database');
const { nationality } = db;

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await nationality.create({
      Name,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Nationality create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await nationality.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await nationality.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "nationality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await nationality.update({
      Name,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await nationality.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "nationality not found" });
    }
  } catch (err) {
    console.error('Nationality update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await nationality.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "nationality deactivated" });
    else res.status(404).json({ message: "nationality not found" });
  } catch (err) {
    console.error('Nationality delete error:', err);
    res.status(500).json({ error: err.message });
  }
};