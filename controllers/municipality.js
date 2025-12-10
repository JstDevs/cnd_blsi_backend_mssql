const { municipality } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode } = req.body;
    const item = await municipality.create({ Name, RegionCode, ProvinceCode, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await municipality.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await municipality.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "municipality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode } = req.body;
    const [updated] = await municipality.update({ Name, RegionCode, ProvinceCode, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await municipality.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "municipality not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await municipality.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "municipality deleted" });
    else res.status(404).json({ message: "municipality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};