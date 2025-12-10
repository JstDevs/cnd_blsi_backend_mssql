const { assignSubdepartment } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { id, LinkID, DepartmentID, SubdepartmentID, Active, CreatedBy, CreatedDate } = req.body;
    const item = await assignSubdepartment.create({ id, LinkID, DepartmentID, SubdepartmentID, Active, CreatedBy, CreatedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await assignSubdepartment.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await assignSubdepartment.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "assignSubdepartment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, LinkID, DepartmentID, SubdepartmentID, Active, CreatedBy, CreatedDate } = req.body;
    const [updated] = await assignSubdepartment.update({ id, LinkID, DepartmentID, SubdepartmentID, Active, CreatedBy, CreatedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await assignSubdepartment.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "assignSubdepartment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await assignSubdepartment.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "assignSubdepartment deleted" });
    else res.status(404).json({ message: "assignSubdepartment not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};