const db = require('../config/database');
const itemUnit = db.itemUnit;

exports.create = async (req, res) => {
  try {
    const { Code, Name } = req.body;
    const item = await itemUnit.create({
      Code,
      Name,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('ItemUnit create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await itemUnit.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    console.error('ItemUnit getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await itemUnit.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "itemUnit not found" });
  } catch (err) {
    console.error('ItemUnit getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name } = req.body;
    const [updated] = await itemUnit.update({
      Code,
      Name,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id }
    });
    if (updated) {
      const updatedItem = await itemUnit.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "itemUnit not found" });
    }
  } catch (err) {
    console.error('ItemUnit update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await itemUnit.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "itemUnit deactivated" });
    else res.status(404).json({ message: "itemUnit not found" });
  } catch (err) {
    console.error('ItemUnit delete error:', err);
    res.status(500).json({ error: err.message });
  }
};