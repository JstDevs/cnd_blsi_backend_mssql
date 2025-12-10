const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TransactionItems', {
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
    ItemID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ChargeAccountID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Quantity: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ItemUnitID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Price: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PriceVatExclusive: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Sub_Total: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ModifyBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ModifyDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TAXCodeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    UniqueID: {
      type: DataTypes.UUID,
      allowNull: true
    },
    Debit: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Credit: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Discounted: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Sub_Total_Vat_Ex: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    BankID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SecondAccountID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TaxName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TaxRate: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    VoucherLink: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    InvoiceNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    EWT: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    WithheldAmount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Vat_Total: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    EWTRate: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Discounts: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    DiscountRate: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AmountDue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    FPP: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NormalBalance: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ResponsibilityCenter: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Vatable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transactionitems',
  
    timestamps: false
  });
};
