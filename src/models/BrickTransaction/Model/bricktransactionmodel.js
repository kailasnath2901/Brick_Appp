'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrickTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BrickTransaction.init({
    clientId: DataTypes.UUID,
    brickTypeId: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    transactionDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BrickTransaction',
  });
  return BrickTransaction;
};