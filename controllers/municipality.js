const db = require('../config/database');
const municipality = db.municipality;

exports.create = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode } = req.body;
    const item = await municipality.create({
      Name,
      RegionCode,
      ProvinceCode,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await municipality.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await municipality.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "municipality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode } = req.body;
    const [updated] = await municipality.update({
      Name,
      RegionCode,
      ProvinceCode,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
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
    const [updated] = await municipality.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "municipality deactivated" });
    else res.status(404).json({ message: "municipality not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};