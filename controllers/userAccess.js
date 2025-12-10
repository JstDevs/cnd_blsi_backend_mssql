const { userAccess } = require('../config/database');
const db = require('../config/database');
const {getAllWithAssociations}=require("../models/associatedDependency");
exports.create = async (req, res) => {
  try {
    const { Description } = req.body;
    const createdBy=req?.user?.id?req?.user?.id:1
    const item = await userAccess.create({ Description, Active: true, CreatedBy:createdBy , CreatedDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(userAccess);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await userAccess.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "userAccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Description, Active, CreatedBy, CreatedDate } = req.body;
    const [updated] = await userAccess.update({ Description, Active, CreatedBy, CreatedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await userAccess.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "userAccess not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await userAccess.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "userAccess deleted" });
    else res.status(404).json({ message: "userAccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};