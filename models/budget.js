const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Budget', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    FiscalYearID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    FundID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ProjectID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SubDepartmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ChartofAccountsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Appropriation: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AppropriationBalance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Change: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Supplemental: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Transfer: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Released: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AllotmentBalance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ChargedAllotment: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PreEncumbrance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Encumbrance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Charges: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    January: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    February: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    March: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    April: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    May: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    June: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    July: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    August: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    September: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    October: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    November: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    December: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    RevisedAmount: {
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
      allowNull: false
    },
    ModifyBy: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ModifyDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'budget',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Budget",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
