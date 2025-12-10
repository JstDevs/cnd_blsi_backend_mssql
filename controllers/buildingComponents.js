const { buildingComponents } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { BuildingComponents, PIN, Createdby, CreatedDate, Modifiedby, ModifiedDate } = req.body;
    const item = await buildingComponents.create({ BuildingComponents, PIN, Createdby, CreatedDate, Modifiedby, ModifiedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await buildingComponents.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await buildingComponents.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "buildingComponents not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { BuildingComponents, PIN, Createdby, CreatedDate, Modifiedby, ModifiedDate } = req.body;
    const [updated] = await buildingComponents.update({ BuildingComponents, PIN, Createdby, CreatedDate, Modifiedby, ModifiedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await buildingComponents.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "buildingComponents not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await buildingComponents.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "buildingComponents deleted" });
    else res.status(404).json({ message: "buildingComponents not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};