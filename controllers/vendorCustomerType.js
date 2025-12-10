const { vendorCustomerType } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await vendorCustomerType.create({ Name, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await vendorCustomerType.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await vendorCustomerType.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "vendorCustomerType not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await vendorCustomerType.update({ Name, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await vendorCustomerType.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "vendorCustomerType not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await vendorCustomerType.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "vendorCustomerType deleted" });
    else res.status(404).json({ message: "vendorCustomerType not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};