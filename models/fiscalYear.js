const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FiscalYear', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    // Year: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true
    // },
    // MonthStart: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true
    // },
    // MonthEnd: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true
    // },
    Year: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MonthStart: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MonthEnd: {
      type: DataTypes.STRING(50),
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
    },
    ModifyBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ModifyDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    AssessedValue: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fiscalyear',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Fiscal Year",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
