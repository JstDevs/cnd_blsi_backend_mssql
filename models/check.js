const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Check', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    DisbursementID: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    BankID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SignatoryType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AccountNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AccountName: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    CheckNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BRSTN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CheckDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Payee: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Words: {
      type: DataTypes.STRING(450),
      allowNull: true
    },
    SignatoryOneID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SignatoryTwoID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(450),
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
    ApprovalProgress: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ApprovalVersion: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'check',
  
    timestamps: false
  });
};
