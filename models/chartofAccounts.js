const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChartofAccounts', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    AccountCode: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AccountTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AccountSubTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AccountCategoryID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    NormalBalance: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Active: {
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
    SL: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chartofaccounts',
  
    timestamps: false
  });
};
