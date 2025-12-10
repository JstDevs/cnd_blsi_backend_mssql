const { Useruseraccess } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { id, UserID, UserAccessID } = req.body;
    const item = await Useruseraccess.create({ id, UserID, UserAccessID });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await Useruseraccess.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Useruseraccess.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "Useruseraccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, UserID, UserAccessID } = req.body;
    const [updated] = await Useruseraccess.update({ id, UserID, UserAccessID }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await Useruseraccess.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Useruseraccess not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Useruseraccess.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "Useruseraccess deleted" });
    else res.status(404).json({ message: "Useruseraccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};