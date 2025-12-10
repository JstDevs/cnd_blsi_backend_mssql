const { subDepartment } = require('../config/database');
const db = require('../config/database');
const {getAllWithAssociations}=require("../models/associatedDependency");
exports.create = async (req, res) => {
  try {
    const { Code, Name, DepartmentID } = req.body;
    const item = await subDepartment.create({ Code, Name, DepartmentID, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const includes = [];
    for (const assocKey in db.subDepartment.associations) {
      includes.push({
        model: db.subDepartment.associations[assocKey].target,
        as: db.subDepartment.associations[assocKey].as
      });
    }
    const items = await getAllWithAssociations(db.subDepartment,1); //subDepartment.findAll();
    res.json({
      items,
      // includes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await subDepartment.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "subDepartment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, DepartmentID } = req.body;
    const [updated] = await subDepartment.update({ Code, Name, DepartmentID, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await subDepartment.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "subDepartment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await subDepartment.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "subDepartment deleted" });
    else res.status(404).json({ message: "subDepartment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};