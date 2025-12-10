const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AssignSubdepartment', {
    LinkID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    DepartmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SubdepartmentID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'assignsubdepartment',
  
    timestamps: false
  });
};
