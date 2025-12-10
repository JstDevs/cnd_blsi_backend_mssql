const { travelers } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, TravelerID } = req.body;
    const item = await travelers.create({ LinkID, TravelerID });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await travelers.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await travelers.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "travelers not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, TravelerID } = req.body;
    const [updated] = await travelers.update({ LinkID, TravelerID }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await travelers.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "travelers not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await travelers.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "travelers deleted" });
    else res.status(404).json({ message: "travelers not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};