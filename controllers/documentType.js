const { documentType } = require('../config/database');
const db = require('../config/database');
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Create a new document type
 *
 * @param {Object} req.body - Document type properties
 * @param {string} req.body.Code - Unique code
 * @param {string} req.body.Name - Display name
 * @param {number} req.body.DocumentTypeCategoryID - Foreign key to document type category
 * @param {string} req.body.Prefix - Prefix number
 * @param {number} req.body.StartNumber - Starting number
 * @param {number} req.body.CurrentNumber - Current number
 * @param {string} req.body.Suffix - Suffix number
 *
 * @return {Object} - Created document type
 */
/*******  947318de-441e-4a2d-b7b0-afb1ce296e26  *******/const { getAllWithAssociations } = require("../models/associatedDependency");

exports.create = async (req, res) => {
  try {
    const { Code, Name, DocumentTypeCategoryID, Prefix, StartNumber, CurrentNumber, Suffix } = req.body;
    const item = await documentType.create({
      Code,
      Name,
      DocumentTypeCategoryID,
      Prefix,
      StartNumber,
      CurrentNumber,
      Suffix,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('DocumentType create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(documentType, 1, { Active: true });
    res.json(items);
  } catch (err) {
    console.error('DocumentType getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await documentType.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "documentType not found" });
  } catch (err) {
    console.error('DocumentType getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, DocumentTypeCategoryID, Prefix, StartNumber, CurrentNumber, Suffix } = req.body;
    const [updated] = await documentType.update({
      Code,
      Name,
      DocumentTypeCategoryID,
      Prefix,
      StartNumber,
      CurrentNumber,
      Suffix,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await documentType.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "documentType not found" });
    }
  } catch (err) {
    console.error('DocumentType update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await documentType.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "DocumentType deactivated" })
    else res.status(404).json({ message: "documentType not found" });
  } catch (err) {
    console.error('DocumentType delete error:', err);
    res.status(500).json({ error: err.message });
  }
};