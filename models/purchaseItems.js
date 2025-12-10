const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PurchaseItems', {
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
    Quantity: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ItemID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Cost: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'purchaseitems',
  
    timestamps: false
  });
};
