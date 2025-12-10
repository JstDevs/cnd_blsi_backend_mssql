const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BurialRecord', {
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
    CustomerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    DeceasedCustomerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CauseofDeath: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Nationality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DeathDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Cementery: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BurialType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Infectious: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Embalmed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Disposition: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Sex: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'burialrecord',
  
    timestamps: false
  });
};
