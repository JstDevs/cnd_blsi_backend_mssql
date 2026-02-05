const { sequelize, Fund, Department } = require('../config/database');
const { Op, fn, col, where, literal, Sequelize } = require('sequelize');
const { Budget, ChartofAccounts, AccountCategory, Funds, FiscalYear, LGU, Municipality, Province, employee, Position } = require('../config/database');
const db = require("../config/database")
// 🔹 GET /api/reports/saaob
exports.getSAAOB = async (req, res) => {
  const { startDate, endDate, fiscalYearID, fundID, userID } = req.query;

  try {
    const result = await Budget.findAll({
      attributes: [
        [Sequelize.literal(`CASE WHEN '${fundID}' = '%' THEN 'All Funds' ELSE \`Funds\`.\`Name\` END`), 'Funds'],
        [Sequelize.literal(`'${endDate}'`), 'Year'],
        [Sequelize.col('FiscalYear.MonthEnd'), 'MonthEnd'],
        [Sequelize.fn('REPLACE', Sequelize.col('ChartofAccounts.AccountCode'), '-', ''), 'AccountCode'],
        [Sequelize.col('ChartofAccounts.AccountCategory.ID'), 'ID'],
        [Sequelize.fn('UPPER', Sequelize.col('ChartofAccounts.AccountCategory.Name')), 'Category'],
        ['Name', 'Name'],
        [Sequelize.literal(`
          CASE 
            WHEN SUM(Budget.Appropriation + Budget.Supplemental + Budget.Transfer) IS NULL 
            THEN 0 
            ELSE SUM(Budget.Appropriation + Budget.Supplemental + Budget.Transfer) 
          END
        `), 'Appropriation'],
        [Sequelize.literal(`COALESCE(SUM(Budget.Released), 0)`), 'Allotment'],
        [Sequelize.literal(`COALESCE(SUM(Budget.Charges), 0)`), 'Obligation'],
        [Sequelize.literal(`
          CASE 
            WHEN SUM(Budget.Appropriation + Budget.Supplemental + Budget.Transfer) - SUM(Budget.Released) IS NULL 
            THEN 0 
            ELSE SUM(Budget.Appropriation + Budget.Supplemental + Budget.Transfer) - SUM(Budget.Released) 
          END
        `), 'UnobligatedAppropriation'],
        [Sequelize.literal(`COALESCE(SUM(Budget.Released) - SUM(Budget.Charges), 0)`), 'UnobligatedAllotment'],
        [Sequelize.fn('UPPER', Sequelize.col('LGU.Municipality.Name')), 'Municipality'],
        [Sequelize.col('LGU.Province.Name'), 'Province'],
        [Sequelize.literal("ISNULL([Employee].[FirstName], '') + ' ' + LEFT(ISNULL([Employee].[MiddleName], ''), 1) + '. ' + ISNULL([Employee].[LastName], '')"), 'RequestedBy'],
        [Sequelize.col('Employee.Position.Name'), 'Position']
      ],
      include: [
        {
          model: ChartofAccounts,
          as: "ChartofAccounts",

          include: [
            {
              model: AccountCategory,
              as: "AccountCategory",

            }
          ],
          where: {
            AccountTypeID: 1
          }
        },
        {
          model: Funds,
          as: "Funds",

        },
        {
          model: FiscalYear,
          as: "FiscalYear",

        },
        {
          model: db.Lgu,
          as: "Lgu",

          where: { ID: 1 },
          include: [
            {
              model: db.municipality,
              as: "Municipality",

            },
            {
              model: db.province,
              as: "Province",

            }
          ]
        },
        {
          model: employee,
          as: "Employee",

          where: { ID: userID },
          include: [
            {
              model: db.position,
              as: "Position",

            }
          ]
        }
      ],
      where: {
        FiscalYearID: fiscalYearID,
        CreatedDate: {
          [Op.between]: [startDate, endDate]
        },
        [Op.and]: Sequelize.where(
          Sequelize.cast(Sequelize.col('Budget.FundID'), 'VARCHAR'),
          {
            [Op.like]: fundID
          }
        )
      },
      group: [
        'Funds.Name',
        'FiscalYear.Year',
        'FiscalYear.MonthEnd',
        'Budget.Name',
        'ChartofAccounts.AccountCode',
        'ChartofAccounts.AccountCategory.ID',
        'ChartofAccounts.AccountCategory.Name',
        'LGU.Municipality.Name',
        'LGU.Province.Name',
        'Employee.FirstName',
        'Employee.MiddleName',
        'Employee.LastName',
        'Employee.Position.Name',
        'Budget.ChartofAccountsID'
      ],
      order: [['ChartofAccountsID', 'ASC']],
      // raw:true
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get SAAOB report' });
  }
};

// 🔹 GET /api/reports/sao
exports.getSAO = async (req, res) => {
  const { startDate, endDate, depID, fiscalYearID, fundID } = req.query;

  try {
    const results = await db.TransactionTable.findAll({
      attributes: [
        ['InvoiceDate', 'Date'],
        ['InvoiceNumber', 'ObligationRequestNumber'],
        [Sequelize.col('TransactionItems.Item.Name'), 'Particulars'],
        [Sequelize.col('Budget.TotalAmount'), 'Appropriation/Allotment'],
        [Sequelize.col('TransactionItems.Price'), 'Expenses'],
        [Sequelize.col('Budget.Released'), 'Balance']
      ],
      where: {
        DocumentTypeID: 13,
        ResponsibilityCenter: depID,
        Status: { [Op.like]: '%Posted%' },
        InvoiceDate: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      include: [
        {
          model: db.TransactionItems,
          as: "TransactionItems",
          include: [
            {
              model: db.Item,
              as: "Item"
              // attributes: []
            }
          ]
        },
        {
          model: db.Budget,
          as: "Budget",

          where: {
            DepartmentID: depID,
            FiscalYearID: fiscalYearID
          },
          include: {
            model: db.Lgu,
            as: "Lgu",
            where: { ID: 1 },
            include: [
              {
                model: db.municipality,
                as: "Municipality"

              }
            ]
          }
        },
        {
          model: db.Funds,
          as: "sourceFunds",
          where: {
            ID: fundID
          }
        },


      ],
      // raw: true
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 GET /api/funds
exports.getFunds = async (req, res) => {
  try {
    const funds = await Fund.findAll({
      where: { Active: true },
      attributes: ['FundName'],
      order: [['FundName', 'ASC']]
    });

    res.json(funds.map(f => f.FundName));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 GET /api/departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { Active: true },
      attributes: ['DepartmentName'],
      order: [['DepartmentName', 'ASC']]
    });

    res.json(departments.map(d => d.DepartmentName));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 GET /api/fiscal-years
exports.getFiscalYears = async (req, res) => {
  try {
    const years = await FiscalYear.findAll({
      where: { Active: true },
      attributes: ['FiscalYear'],
      order: [['FiscalYear', 'DESC']]
    });

    res.json(years.map(y => y.FiscalYear));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Utility: get ID by name (like funGetID)
exports.getIDByName = async (req, res) => {
  const { model, nameField, name } = req.query;

  try {
    const models = { Fund, Department, FiscalYear };
    const Model = models[model];

    if (!Model) {
      return res.status(400).json({ error: 'Invalid model' });
    }

    const record = await Model.findOne({
      where: { [nameField]: name },
      attributes: ['ID']
    });

    if (!record) {
      return res.json({ ID: '%' });
    }

    res.json({ ID: record.ID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
