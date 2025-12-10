const { budgetChange } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { BudgetID, BudgetTypeID, BudgetFrom, BudgetTo, Amount, Acive, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Name, January, February, March, April, May, June, July, August, September, October, November, December, FiscalYearID, DepartmentID, SubDepartmentID, ChartofAccountsID, Active, TotalAmount } = req.body;
    const item = await budgetChange.create({ BudgetID, BudgetTypeID, BudgetFrom, BudgetTo, Amount, Acive, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Name, January, February, March, April, May, June, July, August, September, October, November, December, FiscalYearID, DepartmentID, SubDepartmentID, ChartofAccountsID, Active, TotalAmount });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await budgetChange.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await budgetChange.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "budgetChange not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { BudgetID, BudgetTypeID, BudgetFrom, BudgetTo, Amount, Acive, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Name, January, February, March, April, May, June, July, August, September, October, November, December, FiscalYearID, DepartmentID, SubDepartmentID, ChartofAccountsID, Active, TotalAmount } = req.body;
    const [updated] = await budgetChange.update({ BudgetID, BudgetTypeID, BudgetFrom, BudgetTo, Amount, Acive, CreatedBy, CreatedDate, ModifyBy, ModifyDate, Name, January, February, March, April, May, June, July, August, September, October, November, December, FiscalYearID, DepartmentID, SubDepartmentID, ChartofAccountsID, Active, TotalAmount }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await budgetChange.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "budgetChange not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await budgetChange.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "budgetChange deleted" });
    else res.status(404).json({ message: "budgetChange not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};