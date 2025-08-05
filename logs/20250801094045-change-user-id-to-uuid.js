'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true
    });
  }
};
