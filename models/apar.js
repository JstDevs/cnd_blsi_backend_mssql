const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Apar', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LinkID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    APAR: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RequestedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    RequestedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BudgetID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    VendorID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'Vendor',
      //   key: 'ID'
      // }
    },
    CustomerID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'Customer',
      //   key: 'ID'
      // }
    },
    ReferenceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PONumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DRNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    // BilllingNumber: {
    //   type: DataTypes.STRING(50),
    //   allowNull: true
    // },
    BillingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    BillingDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Total: {
      type: DataTypes.DECIMAL(18,2),
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
    PaymentMethodID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PaymentTermsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BillingNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DocumentTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    uniqueID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    InvoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'apar',
   
    timestamps: false
  });
};
