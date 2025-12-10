const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NoticationTable', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    AddressID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Message: {
      type: DataTypes.STRING(550),
      allowNull: true
    },
    OriginForm: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    OriginID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ReceivedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Read: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'noticationtable',
  
    timestamps: false
  });
};
