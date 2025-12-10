const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ApprovalAudit', {
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
    InvoiceLink: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PositionorEmployee: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PositionorEmployeeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SequenceOrder: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ApprovalOrder: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ApprovalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RejectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(250),
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
    ApprovalVersion: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'approvalaudit',
  
    timestamps: false
  });
};
