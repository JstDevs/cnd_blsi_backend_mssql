const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TransactionTable', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LinkID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    APAR: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DocumentTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    RequestedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    InvoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CustomerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CustomerName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ReferenceNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    P_O_Number: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    D_R_Number: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    InvoiceNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    BillingDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BillingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ShippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PaymentTermsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PaymentMethodID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Total: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AmountReceived: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    RemainingBalance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PaymentType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Credit: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Debit: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    PlaceIssued: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    TIN: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    BusinessEarnings: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    OccupationEarnings: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    IncomeProperty: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    BusinessTaxDue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    OccupationTaxDue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PropertyTaxDue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Interest: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    BasicTax: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Year: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BankID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    uniqueID: {
      type: DataTypes.UUID,
      allowNull: true
    },
    Municipality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LandValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ImprovementValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ReceivedFrom: {
      type: DataTypes.STRING(50),
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
    TaxName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    TaxRate: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    VendorID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TaxableSale: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ReceivedPaymentBy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CheckNumber: {
      type: DataTypes.STRING(100),
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
    AmountinWords: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PreviousPayment: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PropertyID: {
      type: DataTypes.BIGINT,
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
    Discounts: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AmountDue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    VATExcludedPrice: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PropertyID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ModeofPayment: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EmployeeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ResponsibilityCenter: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    T_D_No: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    OfficeUnitProject: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Balance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ObligationRequestNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ApprovalProgress: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BudgetID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TargetID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    FundsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ContraAccountID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ContraNormalBalance: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Paid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    GeneralRevision: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    InstallmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ApprovalVersion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AdvancedYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AdvanceFunds: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    JEVType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TravelLink: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    FiscalYearID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ProjectID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SAI_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SAIDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ALOBSDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PayeeBank: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CheckDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MoneyOrder: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    MoneyOrderDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PostingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CurrentBalance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transactiontable',
    timestamps: false,
    defaultScope: {
      where: {
        Active: true
      }
    },
    scopes: {
      withInactive: {
        where: {}
      }
    }
  });
};
