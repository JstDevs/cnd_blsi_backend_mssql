const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('HomeOwner', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    CustomerID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PropertyCount: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'homeowner',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Home Owner",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
