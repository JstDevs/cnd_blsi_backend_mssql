const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AttachmentTemp', {
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
      type: DataTypes.BLOB,
      allowNull: true
    },
    DataName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DataType: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'attachment_temp',
  
    timestamps: false
  });
};
