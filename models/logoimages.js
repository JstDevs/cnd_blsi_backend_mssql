const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LogoImages', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ImageOne: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageTwo: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageThree: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageFour: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageFive: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageSix: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageSeven: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageEight: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageNine: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ImageTen: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'logoimages',
  
    timestamps: false
  });
};
