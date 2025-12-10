const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContraAccount', {
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
    ContraAccountID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    NormalBalance: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contraaccount',
  
    timestamps: false
  });
};
