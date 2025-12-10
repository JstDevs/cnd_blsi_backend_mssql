const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Fields', {
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    FieldNumber: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DataType: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fields',
  
    timestamps: false
  });
};
