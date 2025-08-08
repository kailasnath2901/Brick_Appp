// src/middleware/brickProductionValidator.js
const Joi = require('joi');

const productionSchema = Joi.object({
    brickTypeId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    productionDate: Joi.date().required()
});

const updateSchema = Joi.object({
    brickTypeId: Joi.number().integer().positive(), 
    quantity: Joi.number().integer().positive(),
    productionDate: Joi.date()
});
function validateCreateProduction(req, res, next) {
    const { error } = productionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

function validateUpdateProduction(req, res, next) {
    const { error } = updateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

module.exports = {
    validateCreateProduction,
    validateUpdateProduction
};
