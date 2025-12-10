const { department } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Code, Name } = req.body;
    const item = await department.create({ Code, Name, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await department.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await department.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "department not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name } = req.body;
    const [updated] = await department.update(
      {
        Code,
        Name,
        ModifyBy: req.user.id,
        ModifyDate: new Date()
      },
      {
        where: { id: req.params.id }
      }
    );
    if (updated) {
      const updatedItem = await department.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "department not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await department.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "department deleted" });
    else res.status(404).json({ message: "department not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};