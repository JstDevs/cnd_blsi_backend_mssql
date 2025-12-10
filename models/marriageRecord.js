const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MarriageRecord', {
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
    CustomerAge: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MarytoID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    MarrytoAge: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cenomar: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RegisterNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ModifyBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ModifyDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'marriagerecord',
  
    timestamps: false
  });
};
