const { barangay } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode, MunicipalityCode } = req.body;
    const item = await barangay.create({ Name, RegionCode, ProvinceCode, MunicipalityCode, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await barangay.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await barangay.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "barangay not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name, RegionCode, ProvinceCode, MunicipalityCode } = req.body;
    const [updated] = await barangay.update({ Name, RegionCode, ProvinceCode, MunicipalityCode, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
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
    const deleted = await barangay.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "barangay deleted" });
    else res.status(404).json({ message: "barangay not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};