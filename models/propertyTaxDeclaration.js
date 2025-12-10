const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyTaxDeclaration', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    T_D_No: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PropertyID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    OwnerID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OwnerTIN: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    OwnerAddress: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OwnerTelephoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BeneficialorAdminUserID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BeneficialorAdminTIN: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BeneficialorAdminAddress: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BeneficialorAdminTelephoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    OCT_TCT_CLOA_Number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'OCT/TCT/CLOA Number'
    },
    // 'OCT/TCT/CLOA Number': {
    //   type: DataTypes.BIGINT,
    //   allowNull: true
    // },
    CCT: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LotNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BlockNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Dated: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    North: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    East: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    South: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    West: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    KindofProperty: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AssessedValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    AmountInWords: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Taxable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    SurveyNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Classification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ActualUse: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Storeys: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    MarketValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    CancelTDNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PreviousAssessedValue: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Createdby: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Class: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AssessmentLevel: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Modifiedby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Modifieddate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    GeneralRevision: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propertytaxdeclaration',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Property Tax Declaration",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
