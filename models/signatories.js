const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Signatories', {
    ID: {
      autoIncrement: false,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    DocumentTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    EmployeeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SequenceNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'signatories',

    timestamps: false
  });
};
