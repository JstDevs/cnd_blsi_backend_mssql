const db = require('../config/database');
const { vendorCustomerType } = db;

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await vendorCustomerType.create({
      Name,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('VendorCustomerType create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await vendorCustomerType.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await vendorCustomerType.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "vendorCustomerType not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await vendorCustomerType.update({
      Name,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await vendorCustomerType.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "vendorCustomerType not found" });
    }
  } catch (err) {
    console.error('VendorCustomerType update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await vendorCustomerType.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "vendorCustomerType deactivated" });
    else res.status(404).json({ message: "vendorCustomerType not found" });
  } catch (err) {
    console.error('VendorCustomerType delete error:', err);
    res.status(500).json({ error: err.message });
  }
};