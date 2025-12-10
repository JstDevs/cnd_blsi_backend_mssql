const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GeneralRevision', {
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
    'General_Revision_Date_Year': {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GeneralRevisionCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TaxDeclarationCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CityorMunicipalityAssessor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CityorMunicipalityAssistantAssessor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ProvincialAssessor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ProvincialAssistantAssessor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Createdby: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Modifiedby: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.DATE,
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
    tableName: 'generalrevision',
  
    timestamps: false
  });
};
