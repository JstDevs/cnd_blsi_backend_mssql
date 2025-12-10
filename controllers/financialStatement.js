const { FinancialStatement } = require('../config/database');
const financialStatement = FinancialStatement;

exports.create = async (req, res) => {
  try {
    const { Code, Name } = req.body;
    const item = await financialStatement.create({ Code, Name, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await financialStatement.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await financialStatement.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "financialStatement not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name } = req.body;
    const [updated] = await financialStatement.update({ Code, Name, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await financialStatement.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "financialStatement not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await financialStatement.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "financialStatement deleted" });
    else res.status(404).json({ message: "financialStatement not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};