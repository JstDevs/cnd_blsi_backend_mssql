const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ApprovalMatrixTemp', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    DocumentTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Version: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SequenceLevel: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AllorMajority: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    NumberofApprover: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    AlteredBy: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    AlteredDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'approvalmatrixtemp',
  
    timestamps: false
  });
};
