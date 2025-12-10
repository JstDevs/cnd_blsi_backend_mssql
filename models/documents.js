const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Documents', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    },
    FileName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    FileDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text1: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date1: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text2: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text3: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date3: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text4: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date4: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text5: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date5: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text6: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date6: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text7: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date7: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text8: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date8: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text9: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date9: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Text10: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Date10: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Expiration: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ExpirationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Confidential: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    PageCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Remarks: {
      type: DataTypes.TEXT,
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
    tableName: 'documents',
  
    timestamps: false
  });
};
