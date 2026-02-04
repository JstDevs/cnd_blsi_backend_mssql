const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const { fn, col, literal } = require("sequelize");
const { Op } = require("sequelize");
const { getAllWithAssociations } = require("../models/associatedDependency");
const db = require('../config/database')
exports.getFunds = async (req, res) => {
  const result = await sequelize.query(
    `SELECT Name FROM Funds WHERE Active = 1`,
    { type: QueryTypes.SELECT }
  );
  res.json([...result.map(r => r.Name), 'All Funds']);
};

exports.getEmployees = async (req, res) => {
  const rows = await sequelize.query(
    `SELECT a.[First Name], a.[Middle Name], a.[Last Name], b.Name AS Department
     FROM Employee a
     INNER JOIN Department b ON a.[Department ID] = b.ID
     WHERE a.Active = 1`,
    { type: QueryTypes.SELECT }
  );

  const result = rows.map(emp => ({
    displayName: `${emp['First Name']} ${emp['Middle Name']} ${emp['Last Name']} - ${emp.Department}`,
    rawName: `${emp['First Name']} ${emp['Middle Name']} ${emp['Last Name']}`
  }));

  res.json(result);
};

exports.getTrialBalance = async (req, res) => {
  const { endDate, fund, approverID, sub } = req.body;

  try {
    // const [firstName, middleName, lastName] = approverRawName.split(" ");

    // const approverResult = await sequelize.query(
    //   `SELECT a.ID FROM Employee a
    //    INNER JOIN Department b ON a.[Department ID] = b.ID
    //    WHERE a.[First Name] = :firstName AND a.[Middle Name] = :middleName AND a.[Last Name] = :lastName`,
    //   {
    //     replacements: { firstName, middleName, lastName },
    //     type: QueryTypes.SELECT
    //   }
    // );
    const approverResult = await getAllWithAssociations(db.employee, 1, {
      ID: approverID
    });
    const approver = approverResult[0]?.ID || '%';

    const fundResult = await db.Funds.findAll({
      where: {
        ID: fund
      },
    });
    const fundID = fundResult[0]?.ID || '%';

    const results = await db.GeneralLedger.findAll({
      include: [
        {
          model: db.ChartofAccounts,
          as: "ChartofAccounts",
          include: [
            {
              model: db.Budget,
              as: 'Budget',
              include: [
                {
                  model: db.FiscalYear,
                  as: 'FiscalYear',
                  attributes: ['MonthStart']
                }
              ]
            }
          ]
        }
      ],
      // where: {
      //   FundID: { [Op.like]: fundID },
      //   CreatedDate: {
      //     [Op.lte]: endDate,
      //     [Op.gte]: literal(`(
      //       SELECT MIN(fy.MonthStart)
      //       FROM Budget b
      //       INNER JOIN FiscalYear fy ON fy.ID = b.FiscalYearID
      //       WHERE b.ChartofAccountsID = ChartofAccounts.ID
      //       LIMIT 1
      //     )`) // Sequelize can't deeply alias this, so approximate logic shown
      //   },
      //   [Op.and]: literal(`LENGTH(REPLACE(GeneralLedger.AccountCode, '-', '')) <= ${sub}`)
      // },
      attributes: [
        [fn('REPLACE', col('GeneralLedger.AccountCode'), '-', ''), 'AccountCode'],
        [col('GeneralLedger.AccountName'), 'AccountName'],
        [fn('SUM', col('GeneralLedger.Debit')), 'Debit'],
        [fn('SUM', col('GeneralLedger.Credit')), 'Credit'],
        [literal(`'${endDate}'`), 'EndDate'],
        [literal(`CASE WHEN '${fundID}' = '%' THEN 'All Funds' ELSE GeneralLedger.FundName END`), 'Funds'],
        [col('ChartofAccounts.Budgets[0].FiscalYear.MonthStart'), 'MonthStart']
      ],
      // group: [
      //   'GeneralLedger.AccountCode',
      //   'GeneralLedger.AccountName',
      //   'GeneralLedger.FundName'
      // ],
      raw: true
    });

    // Fetch approver & municipality separately
    const approverData = await db.employee.findOne({
      where: { ID: approver },
      include: [
        { model: db.position, attributes: ['Name'], as: 'Position' }
      ],
      raw: true
    });

    const municipalityData = await db.Lgu.findOne({
      where: { ID: 1 },
      include: [{ model: db.municipality, as: 'Municipality' }],
      raw: true
    });

    const fullName = `${approverData['FirstName']} ${approverData['MiddleName']?.charAt(0) ?? ''}. ${approverData['LastName']}`;
    const position = approverData['Position.Name'];
    const municipality = municipalityData['Municipality.Name'].toUpperCase();

    // Inject into results
    const final = results.map(r => ({
      ...r,
      FullName: fullName,
      Position: position,
      Municipality: municipality
    }));

    res.json(final);
    // res.json(result)
    // res.json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
