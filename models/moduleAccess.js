const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ModuleAccess', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    UserAccessID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ModuleID: {
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
    Mayor: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'moduleaccess',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Module Access",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
