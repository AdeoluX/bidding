const axios = require('axios');
const { abortIf } = require('../utils/responder');
const httpStatus = require('http-status');

class PaystackService {
  constructor() {
    this.baseURL = process.env.PAYSTACK_URL || 'https://api.paystack.co';
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Get list of banks
  async getBanks() {
    try {
      const response = await this.client.get('/bank');
      return response.data.data;
    } catch (error) {
      abortIf(true, httpStatus.BAD_REQUEST, 'Failed to fetch banks from Paystack');
    }
  }

  // Verify bank account number
  async verifyAccount(accountNumber, bankCode) {
    try {
      const response = await this.client.get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
      return response.data.data;
    } catch (error) {
      abortIf(true, httpStatus.BAD_REQUEST, 'Failed to verify bank account');
    }
  }

  // Create a subaccount (for receiving payments)
  async createSubAccount(accountName, accountNumber, bankCode, businessName) {
    try {
      const response = await this.client.post('/subaccount', {
        business_name: businessName,
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName,
        percentage_charge: 0 // You can adjust this based on your needs
      });
      return response.data.data;
    } catch (error) {
      abortIf(true, httpStatus.BAD_REQUEST, 'Failed to create subaccount');
    }
  }
}

module.exports = new PaystackService(); 