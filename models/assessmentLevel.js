const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AssessmentLevel', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    ClassificationID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    From: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    To: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AssessmentLevel: {
      type: DataTypes.INTEGER,
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
    Ative: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UsingStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'assessmentlevel',
  
    timestamps: false
  });
};
