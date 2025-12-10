const { employmentStatus } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Name } = req.body;
    const item = await employmentStatus.create({ Name, Active: true, CreatedBy: req?.user?.id?req?.user?.id:1, CreatedDate: new Date(), ModifyBy: req?.user?.id?req?.user?.id:1, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await employmentStatus.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await employmentStatus.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "employmentStatus not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Name } = req.body;
    const [updated] = await employmentStatus.update({ Name, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await employmentStatus.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "employmentStatus not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await employmentStatus.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "employmentStatus deleted" });
    else res.status(404).json({ message: "employmentStatus not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};