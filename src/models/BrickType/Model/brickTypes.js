'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BrickType extends Model {
    static associate(models) {
      // For example:
      // BrickType.hasMany(models.BrickProduction, { foreignKey: 'brickTypeId' });
    }
  }

  BrickType.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    pricePerBrick: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'BrickType',      // Singular model name
    tableName: 'BrickTypes',     // Plural table name matching migration
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  return BrickType;
};
