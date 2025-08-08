// src/controller/brickProductionController.js
const brickProductionService = require('../services/brickProductionService');

class BrickProductionController {
    async create(req, res, next) {
        try {
            const data = req.body;
            const newProduction = await brickProductionService.createProduction(data);
            res.status(201).json(newProduction);
        } catch (error) {
            // Handle known Sequelize errors
            if (
                error.name === 'SequelizeForeignKeyConstraintError' ||
                error.message.includes('foreign key constraint fails')
            ) {
                return res.status(400).json({
                    message: 'Invalid brickTypeId. Please make sure it exists in BrickTypes.',
                });
            }

            // Handle custom validation errors
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }

            // Unhandled errors
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const list = await brickProductionService.getAllProductions();
            res.json(list);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const production = await brickProductionService.getProductionById(id);
            if (!production) {
                return res.status(404).json({ message: 'Production not found' });
            }
            res.json(production);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await brickProductionService.updateProduction(id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Production not found' });
            }
            res.json(updated);
        } catch (error) {
            if (
                error.name === 'SequelizeForeignKeyConstraintError' ||
                error.message.includes('foreign key constraint fails')
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid brickTypeId. Please make sure it exists.',
                });
            }

            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid production ID.' });
            }

            const deleted = await brickProductionService.deleteProduction(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Production not found' });
            }

            res.status(200).json({ message: 'Production deleted successfully.' });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new BrickProductionController();
