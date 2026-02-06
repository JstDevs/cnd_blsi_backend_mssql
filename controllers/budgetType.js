const db = require('../config/database');
const { budgetType } = db;

exports.create = async (req, res) => {
  try {
    const { Code, Name, Active } = req.body;
    const item = await budgetType.create({
      Code,
      Name,
      Active,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('BudgetType create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await budgetType.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await budgetType.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "budgetType not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, Active } = req.body;
    const [updated] = await budgetType.update({
      Code,
      Name,
      Active,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await budgetType.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "budgetType not found" });
    }
  } catch (err) {
    console.error('BudgetType update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await budgetType.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "budgetType deactivated" });
    else res.status(404).json({ message: "budgetType not found" });
  } catch (err) {
    console.error('BudgetType delete error:', err);
    res.status(500).json({ error: err.message });
  }
};