const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyClassifications', {
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
    SubClassification: {
      type: DataTypes.STRING(50),
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
      type: DataTypes.DATEONLY,
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
    tableName: 'propertyclassifications',
  
    timestamps: false
  });
};
