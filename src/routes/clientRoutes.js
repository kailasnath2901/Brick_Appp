const express = require('express');
const router = express.Router();
const ClientController = require('../controller/clientController');
const { validateClient } = require('../middleware/clientValidator');

const clientController = new ClientController();

// Create a new client
router.post('/', validateClient, clientController.createClient);

// Get all clients with pagination
router.get('/', clientController.getAllClients);

// Get a single client by ID
router.get('/:id', clientController.getClientById);

// Update client details (non-financial)
router.put('/:id', validateClient, clientController.updateClient);

// Delete (deactivate) a client
router.delete('/:id', clientController.deleteClient);

// Update client financials (credit/debit)
router.post('/:id/transactions', clientController.updateClientFinancials);

module.exports = router;