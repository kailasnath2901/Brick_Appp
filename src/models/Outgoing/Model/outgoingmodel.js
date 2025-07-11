'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Outgoing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Outgoing.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Outgoing.belongsTo(models.Client, {
        foreignKey: 'clientId',
        as: 'client'
      });
      Outgoing.belongsTo(models.BrickType, {   
        foreignKey: 'brickTypeId',
        as: 'brickType'
      });
    }
  }
  Outgoing.init({
    userId: DataTypes.UUID,
    clientId: DataTypes.UUID,
    clientName: DataTypes.STRING,
    clientType: {
      type: DataTypes.ENUM,
      values: ['registered', 'guest', 'driver', 'contractor']
    },
    brickTypeId: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    damagedBricks: DataTypes.INTEGER,
    totalAmount: DataTypes.DECIMAL,
    paymentType: {
      type: DataTypes.ENUM,
      values: ['cash', 'bank_transfer', 'cheque', 'online', 'credit']
    },
    paymentStatus: {
      type: DataTypes.ENUM,
      values: ['pending', 'partial', 'completed', 'failed']
    },
    amountPaid: DataTypes.DECIMAL,
    amountPending: DataTypes.DECIMAL,
    vehicleCharges: DataTypes.DECIMAL,
    vehiclePhoto: DataTypes.STRING,
    outgoingDate: DataTypes.DATE,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Outgoing',
  });
  return Outgoing;
};