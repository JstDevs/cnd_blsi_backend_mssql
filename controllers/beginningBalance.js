// const { BeginningBalance } = require('../config/database');
const BeginningBalanceModel = require('../config/database').BeginningBalance;
const beginningBalance = BeginningBalanceModel;
const FiscalYearModel = require('../config/database').FiscalYear;
const FundsModel = require('../config/database').Funds;
const ChartOfAccountsModel = require('../config/database').ChartofAccounts;
const { col } = require('sequelize');
const db = require('../config/database')

exports.create = async (req, res) => {
  try {
    const { FiscalYearID, FundsID, ChartofAccountsCode, BeginningBalance } = req.body;

    const item = await BeginningBalanceModel.create({
      FiscalYearID,
      FundsID,
      ChartofAccountsCode,
      BeginningBalance,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE')
    });

    const fullItem = await BeginningBalanceModel.findOne({
      where: { ID: item.ID },
      include: [
        {
          model: FiscalYearModel,
          as: 'FiscalYear',
          attributes: ['Name', 'Year'],
        },
        {
          model: FundsModel,
          as: 'Funds',
          attributes: ['Name', 'Code'],
        },
        {
          model: ChartOfAccountsModel,
          as: 'ChartOfAccounts',
          attributes: ['Name', 'AccountCode'],
        },
      ],
    });

    const result = {
      ...fullItem.toJSON(),
      FiscalYearName: fullItem.FiscalYear?.Name || null,
      FiscalYearYear: fullItem.FiscalYear?.Year || null,
      FundCode: fullItem.Funds?.Code || null,
      FundName: fullItem.Funds?.Name || null,
      AccountCode: fullItem.ChartOfAccounts?.AccountCode || null,
      AccountName: fullItem.ChartOfAccounts?.Name || null
    };

    delete result.FiscalYear;
    delete result.Funds;
    delete result.ChartOfAccounts;

    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating beginning balance:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      FiscalYearID,
      FundsID,
      ChartofAccountsCode,
      BeginningBalance
    } = req.body;

    // Update the record
    await BeginningBalanceModel.update(
      {
        FiscalYearID,
        FundsID,
        ChartofAccountsCode,
        BeginningBalance,
        ModifyBy: req.user.id,
        ModifyDate: db.sequelize.fn('GETDATE')
      },
      { where: { ID: id } }
    );

    // Fetch updated item with associations
    const fullItem = await BeginningBalanceModel.findOne({
      where: { ID: id },
      include: [
        {
          model: FiscalYearModel,
          as: 'FiscalYear',
          attributes: ['Name', 'Year'],
        },
        {
          model: FundsModel,
          as: 'Funds',
          attributes: ['Name', 'Code'],
        },
        {
          model: ChartOfAccountsModel,
          as: 'ChartOfAccounts',
          attributes: ['Name', 'AccountCode'],
        },
      ],
    });

    const result = {
      ...fullItem.toJSON(),
      FiscalYearName: fullItem.FiscalYear?.Name || null,
      FiscalYearYear: fullItem.FiscalYear?.Year || null,
      FundCode: fullItem.Funds?.Code || null,
      FundName: fullItem.Funds?.Name || null,
      AccountCode: fullItem.ChartOfAccounts?.AccountCode || null,
      AccountName: fullItem.ChartOfAccounts?.Name || null
    };

    delete result.FiscalYear;
    delete result.Funds;
    delete result.ChartOfAccounts;

    res.json(result);
  } catch (err) {
    console.error('Error updating beginning balance:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.transfer = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { PreviousFiscalYearID, NextFiscalYearID } = req.body;

    if (!PreviousFiscalYearID || !NextFiscalYearID) {
      throw new Error('Both Fiscal Year IDs are required');
    }

    if (PreviousFiscalYearID === NextFiscalYearID) {
      throw new Error('The Fiscal Years cannot be the same');
    }

    // Step 1: Fetch all records from previous fiscal year
    const previousBalances = await BeginningBalanceModel.findAll({
      where: { FiscalYearID: PreviousFiscalYearID },
      transaction: t,
    });

    if (previousBalances.length === 0) {
      return res.status(404).json({ error: 'No records found for previous fiscal year' });
    }

    // Step 2: Prepare new records
    const newBalances = previousBalances.map(entry => ({
      FiscalYearID: NextFiscalYearID,
      FundsID: entry.FundsID,
      ChartofAccountsCode: entry.ChartofAccountsCode,
      BeginningBalance: entry.BeginningBalance,
      TransactionType: entry.TransactionType,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
    }));

    // Step 3: Bulk insert
    await BeginningBalanceModel.bulkCreate(newBalances, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Transfer was successful' });
  } catch (err) {
    console.error('Error transferring beginning balances:', err);
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};


// exports.getAll = async (req, res) => {
//   try {
//     const items = await beginningBalance.findAll();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getAll = async (req, res) => {
  try {
    const { FiscalYearID } = req.body;

    if (!FiscalYearID) {
      return res.status(400).json({ error: 'FiscalYearID is required' });
    }

    const results = await BeginningBalanceModel.findAll({
      attributes: {
        include: [
          [col('FiscalYear.Year'), 'Year'],
          [col('FiscalYear.Name'), 'FiscalYearName'],
          [col('Funds.Name'), 'FundName'],
          [col('Funds.Code'), 'FundCode'],
          [col('ChartOfAccounts.Name'), 'AccountName'],
          [col('ChartOfAccounts.AccountCode'), 'AccountCode'],
        ],
      },
      include: [
        {
          model: FiscalYearModel,
          as: 'FiscalYear',
          attributes: [],
          where: { ID: FiscalYearID },
        },
        {
          model: FundsModel,
          as: 'Funds',
          attributes: [],
        },
        {
          model: ChartOfAccountsModel,
          as: 'ChartOfAccounts',
          attributes: [],
          required: false,
        },
      ],
      raw: true,
    });

    res.json(results);
  } catch (err) {
    console.error('Error loading beginning balances:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.getById = async (req, res) => {
  try {
    const item = await beginningBalance.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "beginningBalance not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await BeginningBalanceModel.destroy({ where: { ID: req.params.id } });
    if (deleted) res.json({ message: "beginningBalance deleted" });
    else res.status(404).json({ message: "beginningBalance not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};