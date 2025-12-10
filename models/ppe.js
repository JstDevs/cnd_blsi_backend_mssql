const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ppe', {
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
    CategoryID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SupplierID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PPENumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Barcode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DateAcquired: {
      type: DataTypes.DATE,
      allowNull: true
    },
    EstimatedUsefulLife: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DepreciationRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    DepreciationValue: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    NetBookValue: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PONumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PRNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    InvoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AIRNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RISNumber: {
      type: DataTypes.STRING(50),
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
    ModifiedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ppe',
  
    timestamps: false
  });
};
