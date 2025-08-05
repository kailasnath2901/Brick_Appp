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
        type: Sequelize.UUID,
        allowNull: false
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clientType: {
        type: Sequelize.ENUM(
          'regular',
          'contractor',
          'wholesaler',
          'retailer'
        ),
        allowNull: false
      },
      brickTypeId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      damagedBricks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentType: {
        type: Sequelize.ENUM(
          'cash',
          'credit',
          'bank_transfer',
          'check',
          'upi'
        ),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM(
          'pending',
          'partial',
          'completed',
          'failed'
        ),
        defaultValue: 'pending'
      },
      amountPaid: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      amountPending: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      vehicleCharges: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      vehiclePhoto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      outgoingDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Add foreign key constraints
    await queryInterface.addConstraint('Outgoings', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_outgoing_user',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Outgoings', {
      fields: ['brickTypeId'],
      type: 'foreign key',
      name: 'fk_outgoing_bricktype',
      references: {
        table: 'BrickTypes',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Outgoings', 'fk_outgoing_user');
    await queryInterface.removeConstraint('Outgoings', 'fk_outgoing_bricktype');
    await queryInterface.dropTable('Outgoings');
  }
};