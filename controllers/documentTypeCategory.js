const db = require('../config/database');
const { documentTypeCategory } = db;

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await documentTypeCategory.create({
      Name,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('DocumentTypeCategory create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await documentTypeCategory.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    console.error('DocumentTypeCategory getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await documentTypeCategory.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "documentTypeCategory not found" });
  } catch (err) {
    console.error('DocumentTypeCategory getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await documentTypeCategory.update({
      Name,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await documentTypeCategory.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "documentTypeCategory not found" });
    }
  } catch (err) {
    console.error('DocumentTypeCategory update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await documentTypeCategory.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "documentTypeCategory deactivated" });
    else res.status(404).json({ message: "documentTypeCategory not found" });
  } catch (err) {
    console.error('DocumentTypeCategory delete error:', err);
    res.status(500).json({ error: err.message });
  }
};