const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ScheduleofBaseunitMarketValue', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    GeneralRevisionYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Classification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ActualUse: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SubClassification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Price: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Createdby: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Modifiedby: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UsingStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'scheduleofbaseunitmarketvalue',
  
    timestamps: false
  });
};
