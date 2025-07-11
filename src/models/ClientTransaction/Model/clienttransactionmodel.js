'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClientTransaction.belongsTo(models.Client, {
        foreignKey: 'clientId',
        as: 'client'
      });
    }
  }
  ClientTransaction.init({
    clientId: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    type: {
      type: DataTypes.ENUM,
      values: ['credit', 'debit', 'payment', 'refund']
    },
    description: DataTypes.TEXT,
    transactionDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ClientTransaction',
  });
  return ClientTransaction;
};