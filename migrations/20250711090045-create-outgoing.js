'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Outgoings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID
      },
      clientId: {
        type: Sequelize.UUID
      },
      clientName: {
        type: Sequelize.STRING
      },
      clientType: {
        type: Sequelize.ENUM
      },
      brickTypeId: {
        type: Sequelize.UUID
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      damagedBricks: {
        type: Sequelize.INTEGER
      },
      totalAmount: {
        type: Sequelize.DECIMAL
      },
      paymentType: {
        type: Sequelize.ENUM
      },
      paymentStatus: {
        type: Sequelize.ENUM
      },
      amountPaid: {
        type: Sequelize.DECIMAL
      },
      amountPending: {
        type: Sequelize.DECIMAL
      },
      vehicleCharges: {
        type: Sequelize.DECIMAL
      },
      vehiclePhoto: {
        type: Sequelize.STRING
      },
      outgoingDate: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Outgoings');
  }
};