const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BusinessApplication', {
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
    ApplicantType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ModeofPayment: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ApplicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DTI_SEC_CDA_Registration: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DTI_SEC_CDA_Registration_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BusinessType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Amendmentfrom: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Amendmentto: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TaxIncentives: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CustomerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BusinessName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Trade_Name_Franchise: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    StreetAddress: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    BarangayID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    MunicipalityID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ProvinceID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RegionID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ZIPCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TelephoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MobileNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EmailAddress: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BusinessArea: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    TotalEmployee: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LessorFullName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    MonthlyRental: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    BusinessActivityID: {
      type: DataTypes.BIGINT,
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
    LessorAddress: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LessorNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LessorEmail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Rental: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    ContactPerson: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ContactNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ContactEmail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ResidingLGU: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'businessapplication',
  
    timestamps: false
  });
};
