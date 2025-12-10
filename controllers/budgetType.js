const { budgetType } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Code, Name, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = req.body;
    const item = await budgetType.create({ Code, Name, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await budgetType.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await budgetType.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "budgetType not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = req.body;
    const [updated] = await budgetType.update({ Code, Name, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await budgetType.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "budgetType not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await budgetType.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "budgetType deleted" });
    else res.status(404).json({ message: "budgetType not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};