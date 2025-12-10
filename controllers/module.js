const { Module } = require('../config/database');

exports.create = async (req, res) => {
  try {
    // console.log("Creating module with data:", req.body);
    const { Description } = req.body;
    const item = await Module.create({ Description });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await Module.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Module.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "Module not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Description } = req.body;
    const [updated] = await Module.update({ Description }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await Module.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Module.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "Module deleted" });
    else res.status(404).json({ message: "Module not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};