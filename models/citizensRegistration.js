const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CitizensRegistration', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    Picture: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    Suffix: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FirstName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    MiddleName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LastName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    BirthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MobileNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    EmailAddress: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    MothersMaidenName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CivilStatus: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ValidID: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    IDNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    FrontID: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    BackID: {
      type: DataTypes.BLOB,
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
    tableName: 'citizensregistration',
  
    timestamps: false
  });
};
