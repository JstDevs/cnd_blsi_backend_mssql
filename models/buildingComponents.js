const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BuildingComponents', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    BuildingComponents: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PIN: {
      type: DataTypes.BIGINT,
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
    }
  }, {
    sequelize,
    tableName: 'buildingcomponents',
  
    timestamps: false
  });
};
