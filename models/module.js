const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Module', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'module',
  
    timestamps: false,
    indexes: [
      {
        name: "PK_Module",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
