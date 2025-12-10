const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TaxDeclarationProperty', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Kind: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    T_D_No: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PropertyID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Classification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Area: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    MarketValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ActualUse: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AssessmentLevel: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AssessmentValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    GeneralRevision: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'taxdeclarationproperty',
  
    timestamps: false
  });
};
