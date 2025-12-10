const { propertyAssessmentLevel } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { ClassificationID, LandClassification, ValueFrom, ValueTo, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active } = req.body;
    const item = await propertyAssessmentLevel.create({ ClassificationID, LandClassification, ValueFrom, ValueTo, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await propertyAssessmentLevel.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await propertyAssessmentLevel.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "propertyAssessmentLevel not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { ClassificationID, LandClassification, ValueFrom, ValueTo, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active } = req.body;
    const [updated] = await propertyAssessmentLevel.update({ ClassificationID, LandClassification, ValueFrom, ValueTo, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await propertyAssessmentLevel.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "propertyAssessmentLevel not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await propertyAssessmentLevel.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "propertyAssessmentLevel deleted" });
    else res.status(404).json({ message: "propertyAssessmentLevel not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};