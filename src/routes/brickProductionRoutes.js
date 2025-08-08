// src/routes/brickProductionRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controller/brickProductionController');
const { validateCreateProduction, validateUpdateProduction } = require('../middleware/brickProductionValidator');

// POST /productions
router.post('/', validateCreateProduction, controller.create);

// GET /productions
router.get('/', controller.getAll);

// GET /productions/:id
router.get('/:id', controller.getById);

// PUT /productions/:id
router.put('/:id', validateUpdateProduction, controller.update);

// DELETE /productions/:id
router.delete('/:id', controller.delete);

module.exports = router;
