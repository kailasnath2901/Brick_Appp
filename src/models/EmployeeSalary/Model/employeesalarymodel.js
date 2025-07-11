'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeSalary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeSalary.init({
    amount: DataTypes.DECIMAL,
    paymentType: {
      type: DataTypes.ENUM,
      values: ['cash', 'bank_transfer', 'cheque', 'online']
    },
    paymentDate: DataTypes.DATE,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'EmployeeSalary',
  });
  return EmployeeSalary;
};