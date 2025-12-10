const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GeneralLedger', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    FundID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    FundName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LedgerItem: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    AccountName: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    AccountCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Debit: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Credit: {
      type: DataTypes.DECIMAL(18,2),
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
    DocumentTypeName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    PostingPeriod: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'generalledger',
  
    timestamps: false
  });
};
