const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Barangay', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    BarangayCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    RegionCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ProvinceCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MunicipalityCode: {
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
    PIN: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'barangay',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Barangay",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
