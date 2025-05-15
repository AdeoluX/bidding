const BaseRepository = require('./base.repo');
const BankAccount = require('../models/bankAccount.model');

class BankAccountRepository extends BaseRepository {
  constructor() {
    super(BankAccount);
  }

  // Custom methods specific to BankAccount model
  async findByCode(code) {
    return this.findOne({ query: { code } });
  }

  async findByUser(userId) {
    return this.findAll({
      query: { user: userId },
      sort: { createdAt: -1 }
    });
  }

  async findActiveAccount(userId) {
    return this.findOne({
      query: { user: userId, isActive: true }
    });
  }

  async findByAccountNumber(accountNumber) {
    return this.findOne({ query: { accountNumber } });
  }

  async setActiveAccount(userId, accountId) {
    // First, deactivate all accounts for the user
    await this.model.updateMany(
      { user: userId },
      { isActive: false }
    );
    
    // Then activate the specified account
    return this.update(accountId, { isActive: true });
  }
}

module.exports = new BankAccountRepository();