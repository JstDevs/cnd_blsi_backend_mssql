const { marketValueMatrix } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Classification, UnitValue, DateFrom, DateTo, Createdby, CreatedDate, Modifiedby, ModifiedDate } = req.body;
    const item = await marketValueMatrix.create({ Classification, UnitValue, DateFrom, DateTo, Createdby, CreatedDate, Modifiedby, ModifiedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await marketValueMatrix.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await marketValueMatrix.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "marketValueMatrix not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Classification, UnitValue, DateFrom, DateTo, Createdby, CreatedDate, Modifiedby, ModifiedDate } = req.body;
    const [updated] = await marketValueMatrix.update({ Classification, UnitValue, DateFrom, DateTo, Createdby, CreatedDate, Modifiedby, ModifiedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await marketValueMatrix.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "marketValueMatrix not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await marketValueMatrix.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "marketValueMatrix deleted" });
    else res.status(404).json({ message: "marketValueMatrix not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};