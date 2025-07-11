'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrickProduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BrickProduction.init({
    brickTypeId: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    productionDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BrickProduction',
  });
  return BrickProduction;
};