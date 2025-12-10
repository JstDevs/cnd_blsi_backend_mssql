const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TransactionProperty', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LinkID: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Municipality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Owner: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    LotAndBlock: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    T_D_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Classification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LandPrice: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ImprovementPrice: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    TotalAssessedValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    TaxDue: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Installment_No: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    InstallmentPayment: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    RemainingBalance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    FullPayment: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Penalty: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Total: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    RequestedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Block: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Discount: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Present: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Lot: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transactionproperty',
  
    timestamps: false
  });
};
