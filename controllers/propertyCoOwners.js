const { propertyCoOwners } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { PropertyID, CoOwnerID, CreatedDate, Createdby } = req.body;
    const item = await propertyCoOwners.create({ PropertyID, CoOwnerID, CreatedDate, Createdby });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await propertyCoOwners.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await propertyCoOwners.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "propertyCoOwners not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { PropertyID, CoOwnerID, CreatedDate, Createdby } = req.body;
    const [updated] = await propertyCoOwners.update({ PropertyID, CoOwnerID, CreatedDate, Createdby }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await propertyCoOwners.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "propertyCoOwners not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await propertyCoOwners.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "propertyCoOwners deleted" });
    else res.status(404).json({ message: "propertyCoOwners not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};