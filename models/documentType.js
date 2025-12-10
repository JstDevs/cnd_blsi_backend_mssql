const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DocumentType', {
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
    DocumentTypeCategoryID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'DocumentTypeCategory',
      //   key: 'ID'
      // }
    },
    Prefix: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    StartNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CurrentNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Suffix: {
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
    }
  }, {
    sequelize,
    tableName: 'documenttype',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Document Type",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
