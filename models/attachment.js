const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Attachment', {
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
    DataImage: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    DataName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DataType: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'attachment',
  
    timestamps: false
  });
};
