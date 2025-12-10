const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    EmployeeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserAccessID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    CreatedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Users",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
