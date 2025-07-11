'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resourceTypeId: {
        type: Sequelize.UUID
      },
      quantity: {
        type: Sequelize.DECIMAL
      },
      pricePerUnit: {
        type: Sequelize.DECIMAL
      },
      totalAmount: {
        type: Sequelize.DECIMAL
      },
      usageDate: {
        type: Sequelize.DATE
      },
      description: {
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
    await queryInterface.dropTable('Resources');
  }
};