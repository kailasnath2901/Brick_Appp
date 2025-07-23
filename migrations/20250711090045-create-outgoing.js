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
        type: Sequelize.ENUM('retail', 'wholesale', 'contractor')
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
        type: Sequelize.DECIMAL(10, 2)
      },
      paymentType: {
        type: Sequelize.ENUM('cash', 'bank', 'upi', 'credit')
      },
      paymentStatus: {
        type: Sequelize.ENUM('paid', 'partial', 'unpaid')
      },
      amountPaid: {
        type: Sequelize.DECIMAL(10, 2)
      },
      amountPending: {
        type: Sequelize.DECIMAL(10, 2)
      },
      vehicleCharges: {
        type: Sequelize.DECIMAL(10, 2)
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Outgoings');

    // Drop ENUM types (especially important for PostgreSQL)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Outgoings_clientType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Outgoings_paymentType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Outgoings_paymentStatus";');
  }
};
