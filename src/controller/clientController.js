const clientService = require('../services/clientService');

class ClientController {

  async createClient(req, res, next) {
    try {
      const clientData = req.body;
      const client = await clientService.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  async getClientById(req, res, next) {
    try {
      const { id } = req.params;
      const client = await clientService.getClientById(id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const { page = 1, limit = 10, activeOnly } = req.query;
      const clients = await clientService.getAllClients({
        page: parseInt(page),
        limit: parseInt(limit),
        activeOnly: activeOnly === 'true'
      });
      res.json(clients);
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedClient = await clientService.updateClient(id, updateData);
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(updatedClient);
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    try {
      const { id } = req.params;
      const result = await clientService.deleteClient(id);
      if (!result) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateClientFinancials(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, type } = req.body; // type: 'credit' or 'debit'
      
      const result = await clientService.updateClientFinancials(id, amount, type);
      if (!result) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClientController;