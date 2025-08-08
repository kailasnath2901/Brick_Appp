// src/services/brickProductionService.js
const db = require('../../models');
const BrickProduction = db.BrickProduction;

const BrickType = db.BrickType;

class BrickProductionService {
    async createProduction(data) {
        // 1. Validate that the BrickType exists before creation
        const brickType = await BrickType.findByPk(data.brickTypeId);
        if (!brickType) {
            const err = new Error(`BrickType does not exist.`);
            err.statusCode = 400;
            throw err;
        }

        // 2. Proceed with creation
        return await BrickProduction.create(data);
    }


    //   async getAllProductions() {
    //     return await BrickProduction.findAll({ order: [['productionDate', 'DESC']] });
    //   }

    async getAllProductions() {
        return await BrickProduction.findAll({
            order: [['productionDate', 'DESC']],
            include: [{
                model: BrickType,
                as: 'brickType',
                attributes: ['id', 'name', 'pricePerBrick', 'isActive'] // include only needed fields
            }]
        });
    }

    async getProductionById(id) {
        return await BrickProduction.findByPk(id);
    }

    // async updateProduction(id, updateData) {
    //     const production = await BrickProduction.findByPk(id);
    //     if (!production) return null;
    //     return await production.update(updateData);
    // }

    async updateProduction(id, updateData) {
        const production = await BrickProduction.findByPk(id);
        if (!production) return null;

        // Check if the brickTypeId is being changed and validate it
        if (updateData.brickTypeId) {
            const brickType = await BrickType.findByPk(updateData.brickTypeId);
            if (!brickType) {
                const err = new Error('BrickType does not exist.');
                err.statusCode = 400;
                throw err;
            }
        }

        return await production.update(updateData);
    }


    async deleteProduction(id) {
        const production = await BrickProduction.findByPk(id);
        if (!production) return null;
        await production.destroy();
        return true;
    }
}

module.exports = new BrickProductionService();
