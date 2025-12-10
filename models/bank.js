const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Bank', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    BranchCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Branch: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    AccountNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    IBAN: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    SwiftCode: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Balance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    CurrencyID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(50),
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
    tableName: 'bank',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Bank",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
