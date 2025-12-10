const { auditTrail } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Module, Action, Script, ParamValues, CreatedDate } = req.body;
    const item = await auditTrail.create({ Module, Action, Script, ParamValues, CreatedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await auditTrail.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await auditTrail.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "auditTrail not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Module, Action, Script, ParamValues, CreatedDate } = req.body;
    const [updated] = await auditTrail.update({ Module, Action, Script, ParamValues, CreatedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await auditTrail.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "auditTrail not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await auditTrail.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "auditTrail deleted" });
    else res.status(404).json({ message: "auditTrail not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};