const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Funds', {
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
    OriginalAmount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Balance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Total: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'funds',
  
    timestamps: false
  });
};
