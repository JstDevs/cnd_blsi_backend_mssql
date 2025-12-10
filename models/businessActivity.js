const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BusinessActivity', {
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
    LineofBusiness: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    NoUnits: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Capitalization: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    GrossSales: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'businessactivity',
  
    timestamps: false
  });
};
