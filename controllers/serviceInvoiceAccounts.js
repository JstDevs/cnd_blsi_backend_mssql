const { ServiceInvoiceAccounts } = require('../config/database');
const serviceInvoiceAccounts = ServiceInvoiceAccounts;

exports.create = async (req, res) => {
  try {
    const { Name, ChartofAccountsID, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Rate } = req.body;
    const item = await serviceInvoiceAccounts.create({ Name, ChartofAccountsID, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Rate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await serviceInvoiceAccounts.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await serviceInvoiceAccounts.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "serviceInvoiceAccounts not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.update = async (req, res) => {
//   try {
//     const { Name, ChartofAccountsID, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Rate } = req.body;
//     const [updated] = await serviceInvoiceAccounts.update({ Name, ChartofAccountsID, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Rate }, {
//       where: { id: req.params.id }
//     });
//     if (updated) {
//       const updatedItem = await serviceInvoiceAccounts.findByPk(req.params.id);
//       res.json(updatedItem);
//     } else {
//       res.status(404).json({ message: "serviceInvoiceAccounts not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.update = async (req, res) => {
  try {
    const {MarriageServiceInvoice, BurialServiceInvoice, DueFromLGU, DueFromRate, DueToLGU, DueToRate, RealPropertyTax, RealPropertyTaxRate} = req.body;

    // update 5 fixed records in ServiceInvoiceAccounts
    const updates = [
      { ID: 1, ChartofAccountsID: MarriageServiceInvoice, Rate: 0, ModifyBy: req.user.id, ModifyDate: new Date() },
      { ID: 2, ChartofAccountsID: BurialServiceInvoice, Rate: 0, ModifyBy: req.user.id, ModifyDate: new Date() },
      { ID: 3, ChartofAccountsID: DueFromLGU, Rate: DueFromRate, ModifyBy: req.user.id, ModifyDate: new Date() },
      { ID: 4, ChartofAccountsID: DueToLGU, Rate: DueToRate, ModifyBy: req.user.id, ModifyDate: new Date() },
      { ID: 5, ChartofAccountsID: RealPropertyTax, Rate: RealPropertyTaxRate, ModifyBy: req.user.id, ModifyDate: new Date() }
    ];

    // Update the records in the database
    for (const update of updates) {
      await serviceInvoiceAccounts.update({ ChartofAccountsID: update.ChartofAccountsID, Rate: update.Rate, ModifyBy: update.ModifyBy, ModifyDate: update.ModifyDate }, {
        where: { ID: update.ID }
      });
    }

    const items = await serviceInvoiceAccounts.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await serviceInvoiceAccounts.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "serviceInvoiceAccounts deleted" });
    else res.status(404).json({ message: "serviceInvoiceAccounts not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};