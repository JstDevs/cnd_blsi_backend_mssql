const db = require('../config/database');
const barangay = db.barangay;

exports.create = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode, MunicipalityCode } = req.body;
    const item = await barangay.create({
      Name,
      RegionCode,
      ProvinceCode,
      MunicipalityCode,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Barangay Create Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await barangay.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await barangay.findOne({ where: { id: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "barangay not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode, MunicipalityCode } = req.body;
    const [updated] = await barangay.update({
      Name,
      RegionCode,
      ProvinceCode,
      MunicipalityCode,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await barangay.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "barangay not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await barangay.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "barangay deactivated" });
    else res.status(404).json({ message: "barangay not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};