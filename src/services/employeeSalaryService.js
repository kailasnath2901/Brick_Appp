const db = require('../../models');
const EmployeeSalary = db.EmployeeSalary;

class EmployeeSalaryService {
  async create(data) {
    return await EmployeeSalary.create(data);
  }

  async getAll() {
    return await EmployeeSalary.findAll({ order: [['paymentDate', 'DESC']] });
  }

  async getById(id) {
    return await EmployeeSalary.findByPk(id);
  }

  async update(id, data) {
    const salary = await EmployeeSalary.findByPk(id);
    if (!salary) return null;
    return await salary.update(data);
  }

  async delete(id) {
    const salary = await EmployeeSalary.findByPk(id);
    if (!salary) return null;
    await salary.destroy();
    return true;
  }
}

module.exports = new EmployeeSalaryService();
