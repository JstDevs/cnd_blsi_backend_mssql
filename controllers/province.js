const db = require('../config/database');
const province = db.province;

exports.create = async (req, res) => {
  try {
    const { RegionCode, Name } = req.body;
    const item = await province.create({
      RegionCode,
      Name,
      Active: true,
      CreatedBy: req.user ? req.user.id : '1',
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await province.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // Note: Model uses ID (uppercase)
    const item = await province.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "province not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { RegionCode, Name } = req.body;
    // Note: Model uses ID (uppercase)
    const [updated] = await province.update({
      RegionCode,
      Name,
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await province.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "province not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await province.update(
      {
        Active: false,
        ModifyBy: req.user ? req.user.id : '1',
        ModifyDate: db.sequelize.fn('GETDATE')
      },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "province deactivated" });
    else res.status(404).json({ message: "province not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};