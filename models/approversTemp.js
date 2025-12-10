const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ApproversTemp', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    LinkID: {
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
    AmountFrom: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AmountTo: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ApprovalVersion: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'approverstemp',
  
    timestamps: false
  });
};
