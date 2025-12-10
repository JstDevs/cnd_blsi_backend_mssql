const { documentAccess } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { id, LinkID, UserID, View, Add, Edit, Delete, Print, Confidential, Active, CreatedBy, CreatedDate } = req.body;
    const item = await documentAccess.create({ id, LinkID, UserID, View, Add, Edit, Delete, Print, Confidential, Active, CreatedBy, CreatedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await documentAccess.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await documentAccess.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "documentAccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, LinkID, UserID, View, Add, Edit, Delete, Print, Confidential, Active, CreatedBy, CreatedDate } = req.body;
    const [updated] = await documentAccess.update({ id, LinkID, UserID, View, Add, Edit, Delete, Print, Confidential, Active, CreatedBy, CreatedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await documentAccess.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "documentAccess not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await documentAccess.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "documentAccess deleted" });
    else res.status(404).json({ message: "documentAccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};