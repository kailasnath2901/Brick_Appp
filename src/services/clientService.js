const db = require('../../models');
const Client = db.Client;

class ClientService {
  async createClient(clientData) {
    // Calculate initial financials
    clientData.totalCredit = clientData.totalCredit || 0;
    clientData.totalDebit = clientData.totalDebit || 0;
    clientData.pendingAmount = (clientData.totalDebit || 0) - (clientData.totalCredit || 0);
    clientData.hasPendingDues = clientData.pendingAmount > 0;
    clientData.isActive = clientData.isActive !== undefined ? clientData.isActive : true;

    return await Client.create(clientData);
  }

  async getClientById(id) {
    return await Client.findByPk(id);
  }

  async getAllClients({ page, limit, activeOnly }) {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (activeOnly) {
      where.isActive = true;
    }

    return await Client.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async updateClient(id, updateData) {
    const client = await Client.findByPk(id);
    if (!client) return null;

    // Prevent direct updates to financial fields through this method
    if (updateData.totalCredit || updateData.totalDebit || updateData.pendingAmount) {
      throw new Error('Use dedicated financial update methods for financial fields');
    }

    return await client.update(updateData);
  }

  async deleteClient(id) {
    const client = await Client.findByPk(id);
    if (!client) return null;

    // Soft delete (set isActive to false)
    await client.update({ isActive: false });
    return true;
  }

  async updateClientFinancials(id, amount, type) {
    if (!['credit', 'debit'].includes(type)) {
      throw new Error('Invalid transaction type. Use "credit" or "debit"');
    }

    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    const client = await Client.findByPk(id);
    if (!client) return null;

    const updateData = {};

    if (type === 'credit') {
      updateData.totalCredit = client.totalCredit + amount;
    } else {
      updateData.totalDebit = client.totalDebit + amount;
    }

    // Recalculate pending amount and dues status
    updateData.pendingAmount = updateData.totalDebit - updateData.totalCredit;
    updateData.hasPendingDues = updateData.pendingAmount > 0;

    return await client.update(updateData);
  }
}

module.exports = new ClientService();