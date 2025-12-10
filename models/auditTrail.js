const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AuditTrail', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Module: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Action: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Script: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ParamValues: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'audittrail',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Audit Trail",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
