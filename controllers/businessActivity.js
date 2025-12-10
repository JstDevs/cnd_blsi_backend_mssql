const { businessActivity } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, LineofBusiness, NoUnits, Capitalization, GrossSales } = req.body;
    const item = await businessActivity.create({ LinkID, LineofBusiness, NoUnits, Capitalization, GrossSales });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await businessActivity.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await businessActivity.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "businessActivity not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, LineofBusiness, NoUnits, Capitalization, GrossSales } = req.body;
    const [updated] = await businessActivity.update({ LinkID, LineofBusiness, NoUnits, Capitalization, GrossSales }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await businessActivity.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "businessActivity not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await businessActivity.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "businessActivity deleted" });
    else res.status(404).json({ message: "businessActivity not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};