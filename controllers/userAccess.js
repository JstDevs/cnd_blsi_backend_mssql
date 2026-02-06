const db = require('../config/database');
const { userAccess } = db;

exports.create = async (req, res) => {
  try {
    const { Description } = req.body;
    const createdBy = req?.user?.id ? req?.user?.id : 1;
    const item = await userAccess.create({
      Description,
      Active: true,
      CreatedBy: createdBy,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: createdBy,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('UserAccess create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await userAccess.findAll({
      where: { Active: true },
      order: [['ID', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    console.error('UserAccess getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await userAccess.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "userAccess not found" });
  } catch (err) {
    console.error('UserAccess getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Description } = req.body;
    const [updated] = await userAccess.update({
      Description,
      ModifyBy: req?.user?.id ?? 1,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await userAccess.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "userAccess not found" });
    }
  } catch (err) {
    console.error('UserAccess update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await userAccess.update(
      { Active: false, ModifyBy: req?.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "userAccess deactivated" });
    else res.status(404).json({ message: "userAccess not found" });
  } catch (err) {
    console.error('UserAccess delete error:', err);
    res.status(500).json({ error: err.message });
  }
};