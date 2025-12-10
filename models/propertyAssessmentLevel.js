const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyAssessmentLevel', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ClassificationID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    LandClassification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ValueFrom: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ValueTo: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AssessmentLevel: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Createdby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Modifiedby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propertyassessmentlevel',
  
    timestamps: false
  });
};
