const db = require('../config/database');
const item = db.Item;
const TaxCodeModel = db.taxCode;

exports.create = async (req, res) => {
  try {
    const { Code, Name, Category, ChargeAccountID, TAXCodeID, UnitID, EWT, PurchaseOrSales, Vatable } = req.body;
    const item_r = await item.create({
      Code,
      Name,
      Category,
      ChargeAccountID,
      TAXCodeID,
      UnitID,
      EWT,
      PurchaseOrSales,
      Vatable,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item_r);
  } catch (err) {
    console.error('Item create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await item.findAll({
      where: { Active: true },
      include: [
        {
          model: TaxCodeModel,
          as: 'TaxCode',
          required: false
        }
      ]
    });
    res.json(items);
  } catch (err) {
    console.error('Item getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item_r = await item.findByPk(req.params.id);
    if (item_r) res.json(item_r);
    else res.status(404).json({ message: "item not found" });
  } catch (err) {
    console.error('Item getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, Category, ChargeAccountID, TAXCodeID, UnitID, EWT, PurchaseOrSales, Vatable } = req.body;
    const [updated] = await item.update({
      Code,
      Name,
      Category,
      ChargeAccountID,
      TAXCodeID,
      UnitID,
      EWT,
      PurchaseOrSales,
      Vatable,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id }
    });
    if (updated) {
      const updatedItem = await item.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "item not found" });
    }
  } catch (err) {
    console.error('Item update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await item.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "item deactivated" });
    else res.status(404).json({ message: "item not found" });
  } catch (err) {
    console.error('Item delete error:', err);
    res.status(500).json({ error: err.message });
  }
};