const db = require('../config/database');
const region = db.region;

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await region.create({
      Name,
      Active: 1,
      CreatedBy: req.user ? req.user.id : '1',
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Region create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await region.findAll({ where: { Active: 1 } });
    res.json(items);
  } catch (err) {
    console.error('Region getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await region.findOne({ where: { ID: req.params.id, Active: 1 } });
    if (item) res.json(item);
    else res.status(404).json({ message: "region not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await region.update({
      Name,
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: 1 }
    });
    if (updated) {
      const updatedItem = await region.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "region not found" });
    }
  } catch (err) {
    console.error('Region update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await region.update(
      { Active: 0, ModifyBy: req.user ? req.user.id : '1', ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: 1 } }
    );
    if (updated) res.json({ message: "region deactivated" });
    else res.status(404).json({ message: "region not found" });
  } catch (err) {
    console.error('Region delete error:', err);
    res.status(500).json({ error: err.message });
  }
};