const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PublicMarketTicketing', {
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
    Items: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    StartTime: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EndTime: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IssuedBy: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DateIssued: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    AmountIssued: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PostingPeriod: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Remarks: {
      type: DataTypes.TEXT,
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
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'publicmarketticketing',
  
    timestamps: false
  });
};
