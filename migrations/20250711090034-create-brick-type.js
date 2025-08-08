'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BrickTypes', {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        unsigned: true  // Only positive numbers
      },
      name: {
        type: Sequelize.STRING(100),  // Limited length
        allowNull: false,
        unique: true  // Prevent duplicate names
      },
      pricePerBrick: {
        type: Sequelize.DECIMAL(10, 2),  // 10 total digits, 2 decimal places
        allowNull: false,
        defaultValue: 0.00
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add index for better performance on frequently queried fields
    await queryInterface.addIndex('BrickTypes', ['name']);
    await queryInterface.addIndex('BrickTypes', ['isActive']);
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first to avoid errors
    await queryInterface.removeIndex('BrickTypes', ['name']);
    await queryInterface.removeIndex('BrickTypes', ['isActive']);
    
    await queryInterface.dropTable('BrickTypes');
  }
};