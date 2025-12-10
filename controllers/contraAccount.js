const { contraAccount } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, ContraAccountID, NormalBalance, Amount } = req.body;
    const item = await contraAccount.create({ LinkID, ContraAccountID, NormalBalance, Amount });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await contraAccount.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await contraAccount.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "contraAccount not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, ContraAccountID, NormalBalance, Amount } = req.body;
    const [updated] = await contraAccount.update({ LinkID, ContraAccountID, NormalBalance, Amount }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await contraAccount.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "contraAccount not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await contraAccount.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "contraAccount deleted" });
    else res.status(404).json({ message: "contraAccount not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};