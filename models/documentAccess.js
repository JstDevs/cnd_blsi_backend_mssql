const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DocumentAccess', {
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    UserID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    View: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Add: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Edit: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Print: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Confidential: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'documentaccess',
  
    timestamps: false
  });
};
