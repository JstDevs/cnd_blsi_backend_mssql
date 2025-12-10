const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BeginningBalance', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FiscalYearID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    FundsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ChartofAccountsCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BeginningBalance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    TransactionType: {
      type: DataTypes.STRING(50),
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
    }
  }, {
    sequelize,
    tableName: 'beginningbalance',
  
    timestamps: false
  });
};
