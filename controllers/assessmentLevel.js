const { assessmentLevel } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { ClassificationID, From, To, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Ative, UsingStatus } = req.body;
    const item = await assessmentLevel.create({ ClassificationID, From, To, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Ative, UsingStatus });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await assessmentLevel.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await assessmentLevel.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "assessmentLevel not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { ClassificationID, From, To, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Ative, UsingStatus } = req.body;
    const [updated] = await assessmentLevel.update({ ClassificationID, From, To, AssessmentLevel, Createdby, CreatedDate, Modifiedby, ModifiedDate, Ative, UsingStatus }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await assessmentLevel.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "assessmentLevel not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await assessmentLevel.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "assessmentLevel deleted" });
    else res.status(404).json({ message: "assessmentLevel not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};