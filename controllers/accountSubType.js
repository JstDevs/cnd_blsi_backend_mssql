const db = require('../config/database');
const { AccountSubType } = db;
const accountSubType = AccountSubType;

exports.create = async (req, res) => {
  try {
    const { Code, Name, AccountTypeID } = req.body;
    const item = await accountSubType.create({
      Code,
      Name,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE'),
      AccountTypeID
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('AccountSubType create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await accountSubType.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    console.error('AccountSubType getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await accountSubType.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "accountSubType not found" });
  } catch (err) {
    console.error('AccountSubType getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, AccountTypeID } = req.body;
    const [updated] = await accountSubType.update({
      Code,
      Name,
      AccountTypeID,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id }
    });
    if (updated) {
      const updatedItem = await accountSubType.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "accountSubType not found" });
    }
  } catch (err) {
    console.error('AccountSubType update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await accountSubType.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "accountSubType deactivated" });
    else res.status(404).json({ message: "accountSubType not found" });
  } catch (err) {
    console.error('AccountSubType delete error:', err);
    res.status(500).json({ error: err.message });
  }
};