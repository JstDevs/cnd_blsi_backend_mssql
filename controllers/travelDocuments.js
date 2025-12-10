const { travelDocuments } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, Name } = req.body;
    const item = await travelDocuments.create({ LinkID, Name });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await travelDocuments.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await travelDocuments.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "travelDocuments not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, Name } = req.body;
    const [updated] = await travelDocuments.update({ LinkID, Name }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await travelDocuments.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "travelDocuments not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await travelDocuments.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "travelDocuments deleted" });
    else res.status(404).json({ message: "travelDocuments not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};