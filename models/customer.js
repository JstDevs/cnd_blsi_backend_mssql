const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Customer', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PaymentTermsID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PaymentMethodID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'PaymentMethod',
      //   key: 'ID'
      // }
    },
    TIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RDO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TaxCodeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TypeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    IndustryTypeID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'IndustryType',
      //   key: 'ID'
      // }
    },
    ContactPerson: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    PhoneNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    MobileNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    EmailAddress: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Website: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    StreetAddress: {
      type: DataTypes.STRING(500),
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
    FirstName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    MiddleName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    LastName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CivilStatus: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PlaceofBirth: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Gender: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Height: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Weight: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Citizenship: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Occupation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ICRNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PlaceofIncorporation: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    KindofOrganization: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DateofRegistration: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customer',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Customer",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
