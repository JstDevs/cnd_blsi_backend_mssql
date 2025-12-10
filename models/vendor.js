const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Vendor', {
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
    DeliveryLeadTime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RDO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Vatable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    TaxCodeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TypeID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'VendorType',
      //   key: 'ID'
      // }
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
      type: DataTypes.STRING(500),
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
    tableName: 'vendor',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Vendor",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
