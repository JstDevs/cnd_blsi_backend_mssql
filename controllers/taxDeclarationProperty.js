const { taxDeclarationProperty } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Kind, T_D_No, PropertyID, Classification, Area, MarketValue, ActualUse, AssessmentLevel, AssessmentValue, GeneralRevision } = req.body;
    const item = await taxDeclarationProperty.create({ Kind, T_D_No, PropertyID, Classification, Area, MarketValue, ActualUse, AssessmentLevel, AssessmentValue, GeneralRevision });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await taxDeclarationProperty.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await taxDeclarationProperty.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "taxDeclarationProperty not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Kind, T_D_No, PropertyID, Classification, Area, MarketValue, ActualUse, AssessmentLevel, AssessmentValue, GeneralRevision } = req.body;
    const [updated] = await taxDeclarationProperty.update({ Kind, T_D_No, PropertyID, Classification, Area, MarketValue, ActualUse, AssessmentLevel, AssessmentValue, GeneralRevision }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await taxDeclarationProperty.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "taxDeclarationProperty not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await taxDeclarationProperty.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "taxDeclarationProperty deleted" });
    else res.status(404).json({ message: "taxDeclarationProperty not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};