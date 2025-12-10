const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BudgetChange', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    BudgetID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BudgetTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'BudgetType',
      //   key: 'ID'
      // }
    },
    BudgetFrom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BudgetTo: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Acive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ModifyBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ModifyDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    January: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    February: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    March: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    April: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    May: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    June: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    July: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    August: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    September: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    October: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    November: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    December: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    FiscalYearID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    DepartmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SubDepartmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ChartofAccountsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'budgetchange',
  
    timestamps: false
  });
};
