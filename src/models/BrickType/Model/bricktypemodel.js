'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrickType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BrickType.init({
    name: DataTypes.STRING,
    pricePerBrick: DataTypes.DECIMAL,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'BrickType',
  });
  return BrickType;
};