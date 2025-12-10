const { noticationTable } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { AddressID, Message, OriginForm, OriginID, LinkID, SentDate, ReceivedDate, Read } = req.body;
    const item = await noticationTable.create({ AddressID, Message, OriginForm, OriginID, LinkID, SentDate, ReceivedDate, Read });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await noticationTable.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await noticationTable.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "noticationTable not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { AddressID, Message, OriginForm, OriginID, LinkID, SentDate, ReceivedDate, Read } = req.body;
    const [updated] = await noticationTable.update({ AddressID, Message, OriginForm, OriginID, LinkID, SentDate, ReceivedDate, Read }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await noticationTable.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "noticationTable not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await noticationTable.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "noticationTable deleted" });
    else res.status(404).json({ message: "noticationTable not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};