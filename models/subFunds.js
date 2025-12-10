const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SubFunds', {
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
    Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    FundsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'subfunds',
  
    timestamps: false
  });
};
