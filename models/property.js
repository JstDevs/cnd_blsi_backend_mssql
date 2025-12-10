const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Property', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
      
    OwnerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AreaSize: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PIN: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    Block: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Lot: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Street: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BarangayID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    MunicipalityID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    RegionID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ZipCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    C: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Classification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SubClassification: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Preparedby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    OCT_TCT_CLOA_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CoOwnerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BeneficialUserID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AdministratorID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AdvancePayment: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    AdvanceYear: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    T_D_No: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'property',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Property",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};