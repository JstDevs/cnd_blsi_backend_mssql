const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Employee', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Picture: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    Signature: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    ReferenceID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    IDNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FirstName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    MiddleName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LastName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    NationalityID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'Nationality',
      //   key: 'ID'
      // }
    },
    Birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Gender: {
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
    EmergencyPerson: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EmergencyNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    TIN: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    SSS: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Pagibig: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Philhealth: {
      type: DataTypes.STRING(50),
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
    DateHired: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EmploymentStatusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'EmploymentStatus',
      //   key: 'ID'
      // }
    },
    EmploymentStatusDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PositionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'Position',
      //   key: 'ID'
      // }
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'Department',
      //   key: 'ID'
      // }
    },
    ReportingTo: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BIGINT,
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
    }
  }, {
    sequelize,
    tableName: 'employee',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Employee",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
