const { propertyClassifications } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { GeneralRevisionYear, Classification, SubClassification, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus } = req.body;
    const item = await propertyClassifications.create({ GeneralRevisionYear, Classification, SubClassification, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await propertyClassifications.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await propertyClassifications.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "propertyClassifications not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { GeneralRevisionYear, Classification, SubClassification, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus } = req.body;
    const [updated] = await propertyClassifications.update({ GeneralRevisionYear, Classification, SubClassification, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await propertyClassifications.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "propertyClassifications not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await propertyClassifications.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "propertyClassifications deleted" });
    else res.status(404).json({ message: "propertyClassifications not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};