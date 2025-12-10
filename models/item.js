const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Item', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ChargeAccountID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TAXCodeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    UnitID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    EWT: {
      type: DataTypes.DECIMAL(18,2),
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
    },
    PurchaseOrSales: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Vatable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'item',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Item",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
