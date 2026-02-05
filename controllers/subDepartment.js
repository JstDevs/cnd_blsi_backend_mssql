const db = require('../config/database');
const subDepartment = db.subDepartment;
const { getAllWithAssociations } = require("../models/associatedDependency");
exports.create = async (req, res) => {
  try {
    const { Code, Name, DepartmentID } = req.body;
    const item = await subDepartment.create({
      Code, Name, DepartmentID,
      Active: 1,
      CreatedBy: req.user ? req.user.id : '1',
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('SubDepartment create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Only return active sub-departments (soft delete filter)
    const items = await getAllWithAssociations(db.subDepartment, 1, { Active: 1 });
    res.json({
      items,
      // includes
    });
  } catch (err) {
    console.error('SubDepartment getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // Only return active sub-department (soft delete filter)
    const item = await subDepartment.findOne({ where: { ID: req.params.id, Active: 1 } });
    if (item) res.json(item);
    else res.status(404).json({ message: "subDepartment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, DepartmentID } = req.body;
    // Only update active sub-departments (soft delete filter)
    const [updated] = await subDepartment.update({
      Code, Name, DepartmentID,
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: 1 }
    });
    if (updated) {
      const updatedItem = await subDepartment.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "subDepartment not found" });
    }
  } catch (err) {
    console.error('SubDepartment update error:', err);
    res.status(500).json({ error: err.message });
  }
};

// SOFT DELETE FUNCTION: Sets Active = false instead of removing from database
// Database table affected: 'subdepartment'
exports.delete = async (req, res) => {
  try {
    // Soft delete - sets Active to false, record remains in database
    const [updated] = await subDepartment.update(
      { Active: 0, ModifyBy: req.user ? req.user.id : '1', ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: 1 } }
    );
    if (updated) res.json({ message: "subDepartment deactivated" });
    else res.status(404).json({ message: "subDepartment not found" });
  } catch (err) {
    console.error('SubDepartment delete error:', err);
    res.status(500).json({ error: err.message });
  }
};