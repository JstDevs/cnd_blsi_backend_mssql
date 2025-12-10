const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TaxCode', {
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
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Rate: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(150),
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
    }
  }, {
    sequelize,
    tableName: 'taxcode',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Tax Code",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
