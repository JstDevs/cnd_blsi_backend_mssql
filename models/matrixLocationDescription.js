const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MatrixLocationDescription', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LocationorDescription: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Createdby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Modifiedby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UsingStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'matrixlocation_description',
  
    timestamps: false
  });
};
