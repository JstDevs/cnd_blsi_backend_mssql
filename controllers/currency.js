const db = require('../config/database');
const currency = db.currency;

exports.create = async (req, res) => {
  try {
    const { Code, Name, Symbol } = req.body;
    const item = await currency.create({
      Code,
      Name,
      Symbol,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Currency create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await currency.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await currency.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "currency not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, Symbol } = req.body;
    const [updated] = await currency.update({
      Code,
      Name,
      Symbol,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id }
    });
    if (updated) {
      const updatedItem = await currency.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "currency not found" });
    }
  } catch (err) {
    console.error('Currency update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await currency.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "currency deactivated" });
    else res.status(404).json({ message: "currency not found" });
  } catch (err) {
    console.error('Currency delete error:', err);
    res.status(500).json({ error: err.message });
  }
};