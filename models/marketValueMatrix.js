const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MarketValueMatrix', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    Classification: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    UnitValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    DateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DateTo: {
      type: DataTypes.DATEONLY,
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
    tableName: 'marketvaluematrix',
  
    timestamps: false
  });
};
