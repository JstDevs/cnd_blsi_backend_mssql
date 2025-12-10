const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyCoOwners', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    PropertyID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CoOwnerID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //   model: 'Customer',
      //   key: 'ID'
      // }
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Createdby: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propertycoowners',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Property Co Owners",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
