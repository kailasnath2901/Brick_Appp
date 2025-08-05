'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientTransactions', {
      // ... other fields remain the same ...
      clientId: {
        type: Sequelize.INTEGER, // Changed to match Clients.id
        allowNull: false,
        references: {
          model: 'Clients', // Must match exact table name
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      // ... rest of the fields ...
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ClientTransactions', 'fk_client_transaction');
    await queryInterface.dropTable('ClientTransactions');
  }
};