const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TravelOrder', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    InvoiceNumber: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TravelerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    BudgetID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    DateCreated: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DateStart: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DateEnd: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    No_of_Days: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    InclusivesDate: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Purpose: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Place: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Venue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    RequiredDocuments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Cost: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Plane: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Vessels: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    PUV: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ServiceVehicle: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    RentedVehicle: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ApprovalProgress: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ApprovalVersion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ObligationLink: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DepartmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PositionID: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'travelorder',
  
    timestamps: false
  });
};
