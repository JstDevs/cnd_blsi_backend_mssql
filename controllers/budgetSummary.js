const db=require('../config/database')
const BudgetModel = require('../config/database').Budget;
const FiscalYearModel = require('../config/database').FiscalYear;
const DepartmentModel = require('../config/database').department;
const SubDepartmentModel = require('../config/database').subDepartment;
const ChartOfAccountsModel = require('../config/database').ChartofAccounts;
const FundModel = require('../config/database').Funds;
const ProjectModel = require('../config/database').Project;

exports.getAll = async (req, res) => {
  try {
    const userDepartmentID = req.query.DepartmentID;

    const whereClause = {
      Active: true,
      ...(userDepartmentID ? { DepartmentID: userDepartmentID } : {})
    };

    const budgets = await BudgetModel.findAll({
      where: whereClause,
      include: [
        {
          model: FiscalYearModel,
          as: 'FiscalYear',
          required: false,
        },
        {
          model: DepartmentModel,
          as: 'Department',
          required: false,
        },
        {
          model: SubDepartmentModel,
          as: 'SubDepartment',
          required: false,
        },
        {
          model: ChartOfAccountsModel,
          as: 'ChartofAccounts',
          required: false,
        },
        {
          model: FundModel,
          as: 'Funds',
          required: false,
        },
        {
          model: ProjectModel,
          as: 'Project',
          required: false,
        }
      ],
      order: [['CreatedDate', 'ASC']]
    });

    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
