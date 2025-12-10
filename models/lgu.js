const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Lgu', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Logo: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RDO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PhoneNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    EmailAddress: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Website: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    StreetAddress: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    BarangayID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    MunicipalityID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ProvinceID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    RegionID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ZIPCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Active: {
      type: DataTypes.BIGINT,
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
    }
  }, {
    sequelize,
    tableName: 'lgu',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_LGU",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
