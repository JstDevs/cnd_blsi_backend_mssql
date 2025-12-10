const { matrixLocationDescription } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LocationorDescription, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus } = req.body;
    const item = await matrixLocationDescription.create({ LocationorDescription, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await matrixLocationDescription.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await matrixLocationDescription.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "matrixLocationDescription not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LocationorDescription, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus } = req.body;
    const [updated] = await matrixLocationDescription.update({ LocationorDescription, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await matrixLocationDescription.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "matrixLocationDescription not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await matrixLocationDescription.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "matrixLocationDescription deleted" });
    else res.status(404).json({ message: "matrixLocationDescription not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};