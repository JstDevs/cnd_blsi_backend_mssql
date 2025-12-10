const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TravelPayment', {
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
    Amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Type: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    BudgetID: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'travelpayment',
  
    timestamps: false
  });
};
