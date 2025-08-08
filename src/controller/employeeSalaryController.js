const service = require('../services/employeeSalaryService');

class EmployeeSalaryController {
    async create(req, res, next) {
        try {
            const salary = await service.create(req.body);
            res.status(201).json(salary);
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await service.getAll();
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const data = await service.getById(id);
            if (!data) return res.status(404).json({ message: 'Employee salary not found' });
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await service.update(id, req.body);
            if (!updated) return res.status(404).json({ message: 'Employee salary not found' });
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await service.delete(id);

            if (!deleted) {
                return res.status(404).json({ message: 'Employee salary not found' });
            }

            return res.status(200).json({ message: 'Employee salary deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new EmployeeSalaryController();
