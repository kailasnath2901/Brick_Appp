// routes/brickTypeRoutes.js
'use strict';

const express = require('express');
const router = express.Router();
const brickTypeController = require('../controller/brickTypeController');

// GET /api/brick-types - Get all brick types
router.get('/', brickTypeController.getAllBrickTypes);

// GET /api/brick-types/active - Get only active brick types
router.get('/active', brickTypeController.getActiveBrickTypes);

// GET /api/brick-types/:id - Get brick type by ID
router.get('/:id', brickTypeController.getBrickTypeById);

// POST /api/brick-types - Create new brick type
router.post('/create', brickTypeController.createBrickType);

// PUT /api/brick-types/:id - Update brick type by ID
router.put('/:id', brickTypeController.updateBrickType);

// PATCH /api/brick-types/:id/toggle-status - Toggle active status
router.patch('/:id/toggle-status', brickTypeController.toggleBrickTypeStatus);

// DELETE /api/brick-types/:id - Delete brick type by ID
router.delete('/:id', brickTypeController.deleteBrickType);

module.exports = router;